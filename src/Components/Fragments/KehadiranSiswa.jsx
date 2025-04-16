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
  const [kehadiranByMapel, setKehadiranByMapel] = useState(null);
  const [idSiswa, setIdSiswa] = useState(null);

  useEffect(() => {
    const fetchKehadiran = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        const id = profileRes.data.data.id;

        setIdSiswa(id); // Simpan ID siswa ke state

        // Validasi ID siswa
        if (!id) {
          throw new Error("ID siswa tidak tersedia");
        }

        // Ambil data kehadiran berdasarkan id_siswa
        const response = await axiosClient.get(`/absen/siswa?id_siswa=${id}`);
        const rawData = response.data.data;
        console.log("Data Kehadiran:", response.data); // Debugging

        // Filter data jadwal yang valid - Dibutuhkan untuk menampilkan semua data ketika tidak ada filter
        const validData = rawData.filter(
          (schedule) =>
            schedule.jadwal &&
            schedule.jadwal.mata_pelajaran &&
            schedule.absensi &&
            schedule.absensi.length > 0
        );

        setSchedulesData(validData);

        // Ambil daftar mata pelajaran unik - Dibutuhkan untuk mengisi opsi dropdown
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

  const fetchKehadiranByMapel = async (idMapel) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/absen/mata_pelajaran?id_mata_pelajaran=${idMapel}&id_siswa=${idSiswa}`
      );

      const mapelName =
        response.data.data[0]?.kelas?.mata_pelajaran?.nama_pelajaran ||
        "Unknown";
      console.log(`Data Kehadiran by Mapel: ${mapelName}`, response.data);
      setKehadiranByMapel(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data kehadiran mata pelajaran:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle perubahan mata pelajaran
  const handleMapelChange = (e) => {
    const value = e.target.value;
    setSelectedMapel(value);
    if (value) {
      fetchKehadiranByMapel(value);
    } else {
      setKehadiranByMapel(null);
    }
  };

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

  const renderKehadiranContent = () => {
    if (kehadiranByMapel) {
      if (Array.isArray(kehadiranByMapel)) {
        return kehadiranByMapel
          .map((kelasData) => {
            // Filter hanya kehadiran siswa yang sedang login
            const kehadiranSiswa = kelasData.kehadiran.filter(
              (item) => item.siswa.id === idSiswa
            );

            if (kehadiranSiswa.length === 0) return null;

            return (
              <div key={`kelas-${kelasData.kelas.id}`} className="mb-6">
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
                      {kehadiranSiswa.map((item, index) => (
                        <tr
                          key={`${item.id || index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="py-2 px-4 border-b">
                            {formatTanggal(item.tanggal)}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {kelasData.kelas.mata_pelajaran.nama_pelajaran}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {formatWaktu(kelasData.jadwal.jam_mulai)} -{" "}
                            {formatWaktu(kelasData.jadwal.jam_selesai)}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
          .filter(Boolean);
      }
      console.error("Data kehadiran bukan array:", kehadiranByMapel);
      return <div>Format data tidak sesuai</div>;
    }

    return (
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
    );
  };

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
            onChange={handleMapelChange}
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

      {renderKehadiranContent()}
    </div>
  );
};

export default KehadiranSiswa;
