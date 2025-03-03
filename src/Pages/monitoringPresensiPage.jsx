import React, { useState } from "react";
import Header from "../Components/Elements/Header/Header";

const MonitoringPresensiPage = () => {
  // Data dummy siswa, bisa digantikan dengan data dari backend
  const [siswa, setSiswa] = useState([
    { id: 1, nama: "John Doe", status: "Hadir" },
    { id: 2, nama: "John Does", status: "Tidak Hadir" },
    { id: 3, nama: "Jane Doe", status: "Hadir" },
    { id: 4, nama: "Michael Smith", status: "Tidak Hadir" },
    { id: 5, nama: "Emily Davis", status: "Hadir" },
    ,
  ]);

  // Fungsi untuk mengubah status presensi
  const handlePresensi = (id, status) => {
    setSiswa((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Header */}
      <Header />

      {/* Judul */}
      <h2 className="text-2xl font-semibold mt-6">PRESENSI SISWA/I</h2>

      {/* Dropdown Filter */}
      <div className="flex space-x-4 mt-4">
        <select className="px-4 py-2 border rounded-xl bg-gray-300">
          <option>Pilih Kelas</option>
          <option>Kelas X</option>
          <option>Kelas XI</option>
        </select>
        <select className="px-4 py-2 border rounded-xl bg-gray-300">
          <option>Pertemuan</option>
          <option>Pertemuan 1</option>
          <option>Pertemuan 2</option>
        </select>
      </div>

      {/* Tabel Presensi */}
      <div className="w-full max-w-4xl mt-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-300">
            <tr>
              <th className="border border-gray-400 px-4 py-2">Nomor Absen</th>
              <th className="border border-gray-400 px-4 py-2">Nama Siswa/i</th>
              <th className="border border-gray-400 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map((s) => (
              <tr key={s.id} className="text-center bg-white">
                <td className="border border-gray-400 px-4 py-2">{s.id}</td>
                <td className="border border-gray-400 px-4 py-2">{s.nama}</td>
                <td className="border border-gray-400 px-4 py-2">
                  <button
                    className={`px-9 py-2 rounded-l-xl ${
                      s.status === "Hadir"
                        ? "bg-green-500 text-white font-medium"
                        : "bg-gray-400 text-white"
                    }`}
                    onClick={() => handlePresensi(s.id, "Hadir")}
                  >
                    Hadir
                  </button>
                  <button
                    className={`px-4 py-2 rounded-r-xl ${
                      s.status === "Tidak Hadir"
                        ? "bg-red-600 text-white font-medium"
                        : "bg-gray-400 text-white"
                    }`}
                    onClick={() => handlePresensi(s.id, "Tidak Hadir")}
                  >
                    Tidak Hadir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitoringPresensiPage;
