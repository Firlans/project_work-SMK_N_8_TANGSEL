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
  7: "Minggu",
};

const JadwalSiswa = () => {
  const [jadwal, setJadwal] = useState([]);
  const [waktuList, setWaktuList] = useState([]);
  const [guruLookup, setGuruLookup] = useState({});
  const [mapelLookup, setMapelLookup] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await axiosClient.get("/profile");
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
        console.error("Gagal mengambil data jadwal:", error);
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {Object.entries(hariMap).map(([idHari, namaHari]) => {
        const rows = getDataByHari(Number(idHari));
        if (rows.length === 0) return null;

        return (
          <div
            key={idHari}
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
                          {row.mapel}
                        </td>
                        <td className="w-1/3 px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 truncate">
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
      })}
    </div>
  );
};

export default JadwalSiswa;
