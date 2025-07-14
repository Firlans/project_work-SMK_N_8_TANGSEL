import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { exportJadwalPDF } from "../../../utils/exportJadwal";
import ExportLoadingModal from "../../Elements/Loading/ExportLoadingModal";
import { PiExportBold } from "react-icons/pi";
import { capitalizeEachWord } from "../../../utils/capitalizeEachWord";

const hariMap = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  7: "Minggu",
};

const JadwalSiswa = () => {
  const [jadwal, setJadwal] = useState([]);
  const [waktuList, setWaktuList] = useState([]);
  const [guruLookup, setGuruLookup] = useState({});
  const [mapelLookup, setMapelLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    nama_lengkap: "",
    nisn: "",
    nis: "",
    kelas: "",
  });
  const [exportProgress, setExportProgress] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await axiosClient.get("/profile");
        setProfile({
          nama_lengkap: profileData.data.nama_lengkap,
          nisn: profileData.data.nisn,
          nis: profileData.data.nis,
          kelas: profileData.data.kelas.nama_kelas,
        });
        const idSiswa = profileData.data.id;

        const [jadwalRes, waktuRes, guruRes, mapelRes] = await Promise.all([
          axiosClient.get(`/jadwal/siswa?id_siswa=${idSiswa}`),
          axiosClient.get("/waktu"),
          axiosClient.get("/guru"),
          axiosClient.get("/mata-pelajaran"),
        ]);

        const waktuSorted = waktuRes.data.data.sort((a, b) => a.id - b.id);

        const guruMap = {};
        guruRes.data.data.forEach((g) => {
          guruMap[g.id] = g.nama;
        });

        const mapelMap = {};
        mapelRes.data.data.forEach((m) => {
          mapelMap[m.id] = m.nama_pelajaran;
        });

        setWaktuList(waktuSorted);
        setGuruLookup(guruMap);
        setMapelLookup(mapelMap);
        setJadwal(jadwalRes.data.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDataByHari = (idHari) => {
    const jadwalHari = jadwal.filter((j) => j.id_hari === idHari);
    return waktuList
      .map((waktu) => {
        const jadwalWaktu = jadwalHari.find((j) => j.id_waktu === waktu.id);
        if (!jadwalWaktu) return null;
        return {
          waktu: `${waktu.jam_mulai.slice(0, 5)} - ${waktu.jam_selesai.slice(
            0,
            5
          )}`,
          mapel: mapelLookup[jadwalWaktu.id_mata_pelajaran] ?? "-",
          guru: guruLookup[jadwalWaktu.id_guru] ?? "-",
        };
      })
      .filter(Boolean);
  };

  const handleExport = async () => {
    try {
      setExportProgress("Memulai export...");
      exportJadwalPDF({
        profile,
        hariMap,
        getDataByHari,
        setExportProgress,
      });
    } catch (err) {
      alert("Export PDF gagal, cek konsol untuk detail.");
    } finally {
      setExportProgress(null);
    }
  };

  if (loading) return <LoadingSpinner text={"Memuat jadwal siswa..."} />;

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          JADWAL SISWA
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

      {jadwal.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada jadwal belajar.
          </p>
        </div>
      ) : (
        Object.entries(hariMap).map(([idHari, namaHari]) => {
          const rows = getDataByHari(Number(idHari));
          if (rows.length === 0) return null;

          return (
            <div
              key={idHari}
              className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
            >
              <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300 ease-in-out">
                {namaHari}
              </h3>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700 transition-all duration-300 ease-in-out">
                    <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300 ease-in-out">
                      <tr>
                        <th className="w-1/4 px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                          Waktu
                        </th>
                        <th className="w-2/5 px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                          Mata Pelajaran
                        </th>
                        <th className="w-1/3 px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                          Guru
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300 ease-in-out">
                      {rows.map((row, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300 ease-in-out"
                        >
                          <td className="w-1/4 px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap transition-colors duration-300 ease-in-out">
                            {row.waktu}
                          </td>
                          <td className="w-2/5 px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate transition-colors duration-300 ease-in-out">
                            {capitalizeEachWord(row.mapel)}
                          </td>
                          <td className="w-1/3 px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate transition-colors duration-300 ease-in-out">
                            {row.guru}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })
      )}

      {exportProgress && <ExportLoadingModal progress={exportProgress} />}
    </div>
  );
};

export default JadwalSiswa;
