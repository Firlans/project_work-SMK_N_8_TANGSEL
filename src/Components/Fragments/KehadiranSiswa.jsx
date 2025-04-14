import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient.js";

// Format tanggal dan waktu
const formatTanggal = (tanggal) => {
  const d = new Date(tanggal);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatWaktu = (waktu) => waktu.slice(0, 5);

const KehadiranSiswa = () => {
  const [dataKehadiran, setDataKehadiran] = useState([]);
  const [mataPelajaran, setMataPelajaran] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const kehadiranRes = await axiosClient.get("/absen"); // ganti dengan URL asli

        const data = kehadiranRes.data.data;
        console.log("Data Kehadiran:", kehadiranRes.data); // ✅ perbaikan di sini
        setDataKehadiran(data);

        // Ambil daftar mata pelajaran unik
        const uniqueMapel = [];
        const mapelSet = new Set();
        data.forEach((item) => {
          const mapel = item.jadwal.mata_pelajaran;
          if (!mapelSet.has(mapel.id)) {
            uniqueMapel.push({
              id: mapel.id,
              nama: mapel.nama_pelajaran,
            });
            mapelSet.add(mapel.id);
          }
        });
        setMataPelajaran(uniqueMapel);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData =
    selectedMapel === "all"
      ? dataKehadiran
      : dataKehadiran.filter(
          (item) => item.jadwal.mata_pelajaran.id === parseInt(selectedMapel)
        );

  if (loading) {
    return <div className="text-center py-10">Memuat data kehadiran...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kehadiran Siswa</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">
            Mata Pelajaran:
          </label>
          <select
            value={selectedMapel}
            onChange={(e) => setSelectedMapel(e.target.value)}
            className="form-select rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">Semua Mata Pelajaran</option>
            {mataPelajaran.map((mapel) => (
              <option key={mapel.id} value={mapel.id}>
                {mapel.nama}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pertemuan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mata Pelajaran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hari dan Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  Pertemuan {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.jadwal.mata_pelajaran.nama_pelajaran}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatTanggal(item.tanggal)} |{" "}
                  {formatWaktu(item.jadwal.jam_mulai)} -{" "}
                  {formatWaktu(item.jadwal.jam_selesai)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.status === "Hadir"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Sakit"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KehadiranSiswa;
