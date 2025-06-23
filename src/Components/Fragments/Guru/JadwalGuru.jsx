import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { exportJadwalPDF } from "../../../utils/exportJadwal";
import ExportLoadingModal from "../../Elements/Loading/ExportLoadingModal";
import { PiExportBold } from "react-icons/pi";
import { FaEye } from "react-icons/fa";

const hariMap = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

const JadwalGuru = () => {
  const navigate = useNavigate();
  const [jadwal, setJadwal] = useState([]);
  const [waktu, setWaktu] = useState([]);
  const [kelasMap, setKelasMap] = useState({});
  const [mapelMap, setMapelMap] = useState({});
  const [guruMapelMap, setGuruMapelMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [exportProgress, setExportProgress] = useState(null);
  const [profileGuru, setProfileGuru] = useState({
    nama_lengkap: "",
    nip: "",
    mapel: "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        setProfileGuru({
          nama_lengkap: profileRes.data.data.nama,
          nip: profileRes.data.data.nip,
        });
        const idGuru = profileRes.data.data.id;

        const [jadwalRes, waktuRes, kelasRes, guruRes, mapelRes] =
          await Promise.all([
            axiosClient.get(`/jadwal/guru/${idGuru}`),
            axiosClient.get("/waktu"),
            axiosClient.get("/kelas"),
            axiosClient.get("/guru"),
            axiosClient.get("/mata-pelajaran"),
          ]);

        const waktuSorted = waktuRes.data.data.sort((a, b) => a.id - b.id);

        const kelasLookup = {};
        kelasRes.data.data.forEach((k) => {
          kelasLookup[k.id] = k.nama_kelas;
        });

        const mapelLookup = {};
        mapelRes.data.data.forEach((m) => {
          mapelLookup[m.id] = m.nama_pelajaran;
        });

        const guruMapelLookup = {};
        guruRes.data.data.forEach((g) => {
          guruMapelLookup[g.id] = g.mata_pelajaran_id;
        });

        setWaktu(waktuSorted);
        setJadwal(jadwalRes.data.data);
        setKelasMap(kelasLookup);
        setMapelMap(mapelLookup);
        setGuruMapelMap(guruMapelLookup);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data jadwal:", error);
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const getDataByHari = (hariId) => {
    const filtered = jadwal.filter((j) => j.id_hari === hariId);

    return waktu
      .map((w) => {
        const found = filtered.find((j) => j.id_waktu === w.id);
        if (!found) return null;

        const mapelName = mapelMap[found.id_mata_pelajaran];

        return {
          id: found.id,
          waktu: `${w.jam_mulai.slice(0, 5)} - ${w.jam_selesai.slice(0, 5)}`,
          kelas: kelasMap[found.id_kelas] ?? "-",
          mapel: mapelName ?? "-",
        };
      })
      .filter((r) => r !== null);
  };

  const handleLihatPertemuan = (jadwalId) => {
    navigate(`/dashboard-guru/jadwal-guru/${jadwalId}/pertemuan`);
  };

  const handleExport = async () => {
    if (!profileGuru) return;

    const getData = (hariId) => {
      const rows = getDataByHari(hariId);
      return rows.map((row) => ({
        waktu: row.waktu,
        mapel: row.mapel,
        guru: row.kelas,
      }));
    };

    try {
      setExportProgress("Memulai export...");
      exportJadwalPDF({
        profile: {
          nama_lengkap: profileGuru.nama_lengkap,
          nip: profileGuru.nip,
        },
        hariMap,
        getDataByHari: getData,
        role: "guru",
        setExportProgress,
      });
      console.log("Export selesai.");
    } catch (err) {
      console.error("Export gagal:", err);
      alert("Export PDF gagal, cek konsol untuk detail.");
    } finally {
      setExportProgress(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 sm:py-8 space-y-6">
      {/* Judul Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          JADWAL GURU
        </h3>
        <button
          onClick={handleExport}
          disabled={!!exportProgress}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 text-sm font-semibold transition
    ${exportProgress ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <PiExportBold size={18} />
          {exportProgress ? "Mengekspor..." : "Export Jadwal"}
        </button>
      </div>

      {Object.entries(hariMap).map(([hariId, namaHari]) => {
        const rows = getDataByHari(parseInt(hariId));
        if (rows.length === 0) return null;

        return (
          <div
            key={hariId}
            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-500 ease-in-out"
          >
            <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-500 ease-in-out">
              {namaHari}
            </h3>

            {/* Table Responsive */}
            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700 transition-all duration-500 ease-in-out">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-500 ease-in-out">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-300 transition-colors duration-500 ease-in-out whitespace-nowrap w-2/12 min-w-[100px]">
                      Waktu
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-300 transition-colors duration-500 ease-in-out whitespace-nowrap w-4/12 min-w-[140px]">
                      Mata Pelajaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-300 transition-colors duration-500 ease-in-out whitespace-nowrap w-4/12 min-w-[140px]">
                      Guru
                    </th>
                    <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-300 transition-colors duration-500 ease-in-out whitespace-nowrap w-2/12 min-w-[90px]">
                      Presensi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-500 ease-in-out">
                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300 ease-in-out"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap transition-colors duration-500 ease-in-out w-2/12 min-w-[100px]">
                        {row.waktu}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate transition-colors duration-500 ease-in-out w-4/12 min-w-[140px]">
                        {row.kelas}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 truncate transition-colors duration-500 ease-in-out w-4/12 min-w-[140px]">
                        {row.mapel}
                      </td>
                      <td className="px-4 py-3 text-center w-2/12 min-w-[90px]">
                        <button
                          onClick={() => handleLihatPertemuan(row.id)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          <FaEye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {exportProgress && <ExportLoadingModal progress={exportProgress} />}
    </div>
  );
};

export default JadwalGuru;
