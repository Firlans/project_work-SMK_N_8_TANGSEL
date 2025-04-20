import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient.js";
import { formatWaktu } from "../../utils/dateFormatter.js";

const JadwalSiswa = () => {
  const [jadwalData, setJadwalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tambahkan mapping untuk hari
  const hariMap = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
    7: "Minggu",
  };

  const [mataPelajaranMap, setMataPelajaranMap] = useState({});

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        const id = profileRes.data.data.id;

        const response = await axiosClient.get(`/jadwal/siswa?id_siswa=${id}`);
        setJadwalData(response.data.data);
        setLoading(false);
        console.log("Jadwal:", response.data.data);
      } catch (error) {
        console.error("Gagal mengambil jadwal:", error);
        setLoading(false);
      }
    };

    fetchJadwal();
  }, []);

  useEffect(() => {
    const fetchMataPelajaran = async () => {
      try {
        const response = await axiosClient.get("/mata-pelajaran");
        const mapelData = {};
        response.data.data.forEach((mapel) => {
          mapelData[mapel.id] = mapel.nama_pelajaran;
        });
        setMataPelajaranMap(mapelData);
      } catch (error) {
        console.error("Gagal mengambil data mata pelajaran:", error);
      }
    };

    fetchMataPelajaran();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        Memuat jadwal...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Jadwal Pelajaran
      </h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900"
                >
                  Hari
                </th>
                <th
                  scope="col"
                  className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900"
                >
                  Jam Mulai
                </th>
                <th
                  scope="col"
                  className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900"
                >
                  Jam Selesai
                </th>
                <th
                  scope="col"
                  className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900"
                >
                  Mata Pelajaran
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {jadwalData.length > 0 ? (
                jadwalData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-2 px-3 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {hariMap[item.id_hari] || item.id_hari}
                    </td>
                    <td className="whitespace-nowrap py-2 px-3 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {formatWaktu(item.jam_mulai)}
                    </td>
                    <td className="whitespace-nowrap py-2 px-3 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {formatWaktu(item.jam_selesai)}
                    </td>
                    <td className="whitespace-normal py-2 px-3 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {mataPelajaranMap[item.id_mata_pelajaran] ||
                        item.id_mata_pelajaran}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-4 text-center text-sm text-gray-500"
                  >
                    Tidak ada jadwal tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JadwalSiswa;
