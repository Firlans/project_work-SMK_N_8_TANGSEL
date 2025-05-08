import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient.js";
import { formatTanggal, formatWaktu } from "../../../utils/dateFormatter.js";

const KehadiranSiswa = () => {
  const [schedulesData, setSchedulesData] = useState([]);
  const [mataPelajaran, setMataPelajaran] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kehadiranByMapel, setKehadiranByMapel] = useState(null);
  const [idSiswa, setIdSiswa] = useState(null);

  useEffect(() => {
    const fetchKehadiranByIdSiswa = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        const id = profileRes.data.data.id;
        console.log("Profile ID:", id);
        setIdSiswa(id);

        if (!id) {
          throw new Error("ID siswa tidak tersedia");
        }

        const response = await axiosClient.get(`/absen/siswa?id_siswa=${id}`);
        console.log("Raw Kehadiran Data:", response.data);
        const kehadiranData = response.data.data;

        // Fix unique mata pelajaran collection
        const uniqueMapel = kehadiranData.reduce((acc, item) => {
          const mapel = item.jadwal?.mata_pelajaran;
          // console.log("Processing Mapel:", mapel);
          if (mapel && !acc.some((m) => m.id === mapel.id)) {
            acc.push({
              id: mapel.id,
              nama: mapel.nama_pelajaran,
            });
          }
          return acc;
        }, []);
        console.log("Unique Mapel List:", uniqueMapel);

        setSchedulesData(kehadiranData);
        setMataPelajaran(uniqueMapel);
        setLoading(false);
      } catch (error) {
        console.error("Fetch Error Details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        console.error(
          "Gagal mengambil data kehadiran:",
          error.response?.data || error.message
        );
        setLoading(false);
      }
    };

    fetchKehadiranByIdSiswa();
  }, []);

  const fetchKehadiranByMapel = async (idMapel) => {
    try {
      setLoading(true);

      // Get jadwal data
      const jadwalResponse = await axiosClient.get(
        `/jadwal/mata-pelajaran?id_siswa=${idSiswa}&id_mata_pelajaran=${idMapel}`
      );
      console.log("Jadwal Response:", jadwalResponse.data);

      // Get kehadiran data
      const kehadiranResponse = await axiosClient.get(
        `/absen/mata-pelajaran?id_siswa=${idSiswa}&id_mata_pelajaran=${idMapel}`
      );
      console.log("Kehadiran Response:", kehadiranResponse.data);

      // Get selected mata pelajaran details
      const selectedMapelDetails = mataPelajaran.find(
        (m) => m.id === parseInt(idMapel)
      );

      // Transform data to include jadwal information
      const transformedData = kehadiranResponse.data.data.map((item) => {
        const matchingJadwal = jadwalResponse.data.data.find(
          (j) => j.id_mata_pelajaran === parseInt(idMapel)
        );

        return {
          ...item,
          jadwal: matchingJadwal
            ? {
                id: matchingJadwal.id,
                jam_mulai: matchingJadwal.jam_mulai,
                jam_selesai: matchingJadwal.jam_selesai,
                mata_pelajaran: {
                  id: parseInt(idMapel),
                  nama_pelajaran: selectedMapelDetails?.nama,
                },
              }
            : null,
        };
      });

      console.log("Final Transformed Data:", transformedData);
      setKehadiranByMapel(transformedData);
    } catch (error) {
      console.error("Fetch By Mapel Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle perubahan mata pelajaran
  const handleMapelChange = (e) => {
    const value = e.target.value;
    console.log("Selected Mapel Value:", value);
    setSelectedMapel(value);
    if (value) {
      fetchKehadiranByMapel(value);
    } else {
      console.log("Clearing Kehadiran By Mapel");
      setKehadiranByMapel(null);
    }
  };

  // Filter data berdasarkan mapel yang dipilih
  const filteredData = selectedMapel
    ? schedulesData.filter((item) => {
        // console.log("Filtering item:", item);
        return item.jadwal?.mata_pelajaran?.id === parseInt(selectedMapel);
      })
    : schedulesData;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        Memuat data kehadiran...
      </div>
    );
  }

  // The data is already in the correct format from the API

  const renderDefaultContent = () => (
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
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={`${item.id}-${index}`} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {formatTanggal(item.tanggal)}
                </td>
                <td className="py-2 px-4 border-b">
                  {item.jadwal?.mata_pelajaran?.nama_pelajaran || "-"}
                </td>
                <td className="py-2 px-4 border-b">
                  {item.jadwal
                    ? `${formatWaktu(item.jadwal.jam_mulai)} - ${formatWaktu(
                        item.jadwal.jam_selesai
                      )}`
                    : "-"}
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
                <td className="py-2 px-4 border-b">{item.keterangan || "-"}</td>
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

  const renderKehadiranContent = () => {
    if (kehadiranByMapel) {
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
              {kehadiranByMapel.length > 0 ? (
                kehadiranByMapel.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {formatTanggal(item.tanggal)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {item.jadwal?.mata_pelajaran?.nama_pelajaran || "-"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {item.jadwal
                        ? `${formatWaktu(
                            item.jadwal.jam_mulai
                          )} - ${formatWaktu(item.jadwal.jam_selesai)}`
                        : "-"}
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
    }

    return renderDefaultContent();
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
