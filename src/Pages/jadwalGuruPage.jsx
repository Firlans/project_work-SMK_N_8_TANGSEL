import React from "react";
import Headers from "../Components/Elements/Header/Header";

const JadwalGuruPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      <Headers></Headers>

      {/* Main Content */}
      <main className="w-full max-w-6xl mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">JADWAL MENGAJAR</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-300 text-left">
            <thead>
              <tr className="bg-gray-400">
                <th className="py-3 px-4 border">Hari</th>
                <th className="py-3 px-4 border">Jam Mulai</th>
                <th className="py-3 px-4 border">Jam Selesai</th>
                <th className="py-3 px-4 border">Mata Pelajaran</th>
                <th className="py-3 px-4 border">Kelas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border">Senin</td>
                <td className="py-2 px-4 border">07:00</td>
                <td className="py-2 px-4 border">08:30</td>
                <td className="py-2 px-4 border">Matematika</td>
                <td className="py-2 px-4 border">XII IPA 1</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border">Selasa</td>
                <td className="py-2 px-4 border">08:45</td>
                <td className="py-2 px-4 border">10:15</td>
                <td className="py-2 px-4 border">Fisika</td>
                <td className="py-2 px-4 border">XI IPA 2</td>
              </tr>
              {/* Tambahkan data lain sesuai kebutuhan */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default JadwalGuruPage;
