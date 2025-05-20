import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

const hariMap = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

const JadwalSiswa = () => {
  const [jadwal, setJadwal] = useState([]);
  const [waktu, setWaktu] = useState([]);
  const [guruMap, setGuruMap] = useState({});
  const [mapelMap, setMapelMap] = useState({});
  const [guruMapelMap, setGuruMapelMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        const idSiswa = profileRes.data.data.id;

        const [jadwalRes, waktuRes, guruRes, mapelRes] = await Promise.all([
          axiosClient.get(`/jadwal/siswa?id_siswa=${idSiswa}`),
          axiosClient.get("/waktu"),
          axiosClient.get("/guru"),
          axiosClient.get("/mata-pelajaran"),
        ]);

        console.log("Jadwal Response:", jadwalRes.data.data);
        console.log("Waktu Response:", waktuRes.data.data);
        console.log("Guru Response:", guruRes.data.data);
        console.log("Mapel Response:", mapelRes.data.data);

        const waktuSorted = waktuRes.data.data.sort((a, b) => a.id - b.id);

        const guruLookup = {};
        guruRes.data.data.forEach((g) => {
          guruLookup[g.id] = g.nama;
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
        setGuruMap(guruLookup);
        setMapelMap(mapelLookup);
        setGuruMapelMap(guruMapelLookup);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data jadwal:", error);
      } finally {
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
        return {
          waktu: `${w.jam_mulai.slice(0, 5)} - ${w.jam_selesai.slice(0, 5)}`,
          mapel: found ? mapelMap[guruMapelMap[found.id_guru]] ?? "-" : "-",
          guru: found ? guruMap[found.id_guru] : "-",
        };
      })
      .filter((r) => r !== null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
            {rows.length === 0 || rows.every((r) => r.mapel === "-") ? (
              <p className="text-sm sm:text-base text-gray-500">
                Belum ada jadwal.
              </p>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                          Waktu
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                          Mata Pelajaran
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                          Guru
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {rows.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                            {row.waktu}
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                            {row.mapel}
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                            {row.guru}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default JadwalSiswa;
