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
  const [loading, setLoading] = useState(true);
  const [exportProgress, setExportProgress] = useState(null);
  const [profileGuru, setProfileGuru] = useState({
    nama_lengkap: "",
    nip: "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        const idGuru = profileRes.data.data.id;
        setProfileGuru({
          nama_lengkap: profileRes.data.data.nama,
          nip: profileRes.data.data.nip,
        });

        const [jadwalRes, waktuRes, kelasRes, mapelRes] = await Promise.all([
          axiosClient.get(`/jadwal/guru/${idGuru}`),
          axiosClient.get("/waktu"),
          axiosClient.get("/kelas"),
          axiosClient.get("/mata-pelajaran"),
        ]);

        const waktuSorted = waktuRes.data.data.sort((a, b) =>
          a.jam_mulai.localeCompare(b.jam_mulai)
        );

        const kelasLookup = {};
        kelasRes.data.data.forEach((k) => {
          kelasLookup[k.id] = k.nama_kelas;
        });

        const mapelLookup = {};
        mapelRes.data.data.forEach((m) => {
          mapelLookup[m.id] = m.nama_pelajaran;
        });

        setJadwal(jadwalRes.data.data);
        setWaktu(waktuSorted);
        setKelasMap(kelasLookup);
        setMapelMap(mapelLookup);
        setLoading(false);
      } catch (error) {
        alert("Gagal mengambil data");
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const groupJadwalBySesi = () => {
    const grouped = {};
    jadwal.forEach((item) => {
      const key = `${item.id_kelas}-${item.id_hari}-${item.id_mata_pelajaran}`;
      if (!grouped[key]) {
        grouped[key] = {
          id_kelas: item.id_kelas,
          id_hari: item.id_hari,
          id_mata_pelajaran: item.id_mata_pelajaran,
          semuaJadwalId: [],
          waktuList: [],
          kelas: kelasMap[item.id_kelas],
          mapel: mapelMap[item.id_mata_pelajaran],
          jadwalUtama: item,
        };
      }
      grouped[key].semuaJadwalId.push(item.id);
      grouped[key].waktuList.push(item.id_waktu);
    });
    return Object.values(grouped);
  };

  const flattenGroupedToRows = () => {
    const groups = groupJadwalBySesi();
    const rows = [];

    groups.forEach((group) => {
      group.waktuList.forEach((idWaktu) => {
        const waktuItem = waktu.find((w) => w.id === idWaktu);
        const idJadwal = group.semuaJadwalId.find((idJ) => {
          const jadwalItem = jadwal.find((j) => j.id === idJ);
          return jadwalItem?.id_waktu === idWaktu;
        });

        if (waktuItem && idJadwal) {
          rows.push({
            id: idJadwal,
            idUtama: group.jadwalUtama.id,
            hari: group.id_hari,
            waktu: `${waktuItem.jam_mulai.slice(
              0,
              5
            )} - ${waktuItem.jam_selesai.slice(0, 5)}`,
            kelas: group.kelas ?? "-",
            mapel: group.mapel ?? "-",
          });
        }
      });
    });

    return rows.sort((a, b) => {
      const waktuA = a.waktu.split(" - ")[0];
      const waktuB = b.waktu.split(" - ")[0];
      return waktuA.localeCompare(waktuB);
    });
  };

  const handleLihatPertemuan = (jadwalId) => {
    navigate(`/dashboard-guru/jadwal-guru/${jadwalId}/pertemuan`);
  };

  const handleExport = () => {
    const getData = (hariId) => {
      return flattenGroupedToRows()
        .filter((row) => row.hari === parseInt(hariId))
        .map((row) => ({
          waktu: row.waktu,
          mapel: row.mapel,
          guru: row.kelas,
        }));
    };

    setExportProgress("Memulai export...");
    try {
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
    } catch (err) {
      alert("Export PDF gagal, cek konsol untuk detail.");
    } finally {
      setExportProgress(null);
    }
  };

  if (loading) return <LoadingSpinner text={"Memuat jadwal guru..."} />;

  const allRows = flattenGroupedToRows();

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 sm:py-8 space-y-6">
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
        const rows = allRows.filter((row) => row.hari === parseInt(hariId));
        if (rows.length === 0) return null;

        return (
          <div
            key={hariId}
            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
          >
            <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {namaHari}
            </h3>

            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700 transition-all duration-300 ease-in-out">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-all duration-300 ease-in-out">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-300 transition-all duration-300 ease-in-out">
                      Waktu
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-300 transition-all duration-300 ease-in-out">
                      Kelas
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-300 transition-all duration-300 ease-in-out">
                      Mata Pelajaran
                    </th>
                    <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-300 transition-all duration-300 ease-in-out">
                      Presensi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out">
                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out">
                        {row.waktu}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out">
                        {row.kelas}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out">
                        {row.mapel}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleLihatPertemuan(row.idUtama)}
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
