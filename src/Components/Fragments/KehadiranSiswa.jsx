import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient.js";

// Format tanggal ke bahasa Indonesia
const formatTanggal = (tanggal) => {
  const d = new Date(tanggal);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Potong waktu hanya ambil jam:menit
const formatWaktu = (waktu) => waktu.slice(0, 5);

const KehadiranSiswa = () => {
  const [schedulesData, setSchedulesData] = useState([]);
  const [mataPelajaran, setMataPelajaran] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKehadiran = async () => {
      try {
        // Ambil data profil siswa
        const profileRes = await axiosClient.get("/profile");
        const idSiswa = profileRes.data.data.id;
        console.log("ID Siswa:", idSiswa); // Debugging

        if (!idSiswa) {
          throw new Error("ID siswa tidak ditemukan di profile.");
        }

        // Ambil data kehadiran berdasarkan id_siswa
        const response = await axiosClient.get(
          `/absen/siswa?id_siswa=${idSiswa}`
        );
        const rawData = response.data.data;
        console.log("Data Kehadiran:", response.data); // Debugging

        // Filter data jadwal yang valid
        const validData = rawData.filter(
          (schedule) =>
            schedule.jadwal &&
            schedule.jadwal.mata_pelajaran &&
            schedule.absensi &&
            schedule.absensi.length > 0
        );

        setSchedulesData(validData);

        // Ambil daftar mata pelajaran unik
        const uniqueMapel = validData.reduce((acc, schedule) => {
          const mapel = schedule.jadwal.mata_pelajaran;
          if (!acc.some((item) => item.id === mapel.id)) {
            acc.push({
              id: mapel.id,
              nama: mapel.nama_pelajaran,
            });
          }
          return acc;
        }, []);

        setMataPelajaran(uniqueMapel);
        setLoading(false);
      } catch (error) {
        console.error(
          "Gagal mengambil data kehadiran:",
          error.response?.data || error.message
        );
        setLoading(false);
      }
    };

    fetchKehadiran();
  }, []);

  // Filter data berdasarkan mapel yang dipilih
  const filteredData = selectedMapel
    ? schedulesData.filter(
        (schedule) =>
          schedule.jadwal.mata_pelajaran.id === parseInt(selectedMapel)
      )
    : schedulesData;

  // Flatten attendance data untuk ditampilkan
  const flattenedAttendanceData = filteredData.flatMap((schedule) =>
    schedule.absensi.map((attendance) => ({
      ...attendance,
      jadwal: schedule.jadwal,
    }))
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        Memuat data kehadiran...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-6">
        <h2 className="text-2xl font-bold mb-4">Riwayat Kehadiran Siswa</h2>

        <div className="flex items-center">
          <label htmlFor="filterMapel" className="font-semibold text-gray-600">
            Mata Pelajaran:
          </label>
          <select
            id="filterMapel"
            value={selectedMapel || ""}
            onChange={(e) => setSelectedMapel(e.target.value)}
            className="ml-2 p-2 border rounded-md"
          >
            <option value="">Semua</option>
            {mataPelajaran.map((mapel) => (
              <option key={mapel.id} value={mapel.id}>
                {mapel.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Tanggal</th>
              <th className="py-2 px-4 border-b">Mata Pelajaran</th>
              <th className="py-2 px-4 border-b">Jam</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {flattenedAttendanceData.length > 0 ? (
              flattenedAttendanceData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {formatTanggal(item.tanggal)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.jadwal.mata_pelajaran.nama_pelajaran}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatWaktu(item.jadwal.jam_mulai)} -{" "}
                    {formatWaktu(item.jadwal.jam_selesai)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        item.status === "Hadir"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Sakit"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "Izin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.keterangan || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  Tidak ada data kehadiran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KehadiranSiswa;
