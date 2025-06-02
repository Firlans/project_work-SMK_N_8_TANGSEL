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
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {Object.entries(hariMap).map(([hariId, namaHari]) => {
            const rows = getDataByHari(parseInt(hariId));
            if (rows.length === 0) return null;
            return (
              <div
                key={hariId}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800">
                  {namaHari}
                </h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full table-fixed divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-1/4 px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                            Waktu
                          </th>
                          <th className="w-2/5 px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                            Mata Pelajaran
                          </th>
                          <th className="w-1/3 px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                            Guru
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {rows.map((row, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="w-1/4 px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                              {row.waktu}
                            </td>
                            <td className="w-2/5 px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 truncate">
                              {row.kelas}
                            </td>
                            <td className="w-1/3 px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 truncate">
                              {row.mapel}
                              <button
                                onClick={() => handleLihatPertemuan(row.id)}
                                className="text-blue-600 hover:underline"
                              >
                                Lihat Pertemuan
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default JadwalGuru;
