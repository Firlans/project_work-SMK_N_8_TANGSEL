import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 sm:py-8 space-y-6">
      {/* Judul Halaman */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
          JADWAL GURU
        </h3>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        Object.entries(hariMap).map(([hariId, namaHari]) => {
          const rows = getDataByHari(parseInt(hariId));
          if (rows.length === 0) return null;

          return (
            <div
              key={hariId}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6"
            >
              {/* Nama Hari */}
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
                {namaHari}
              </h2>

              {/* Table Responsive */}
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-500">
                        Waktu
                      </th>
                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-500">
                        Mata Pelajaran
                      </th>
                      <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-500">
                        Guru
                      </th>
                      <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold text-gray-500">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                          {row.waktu}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 truncate">
                          {row.kelas}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 truncate">
                          {row.mapel}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleLihatPertemuan(row.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            Presensi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default JadwalGuru;
