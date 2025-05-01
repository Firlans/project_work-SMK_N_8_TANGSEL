import { useState, useEffect, useMemo } from "react";
import axiosClient from "../../axiosClient";
import LoadingSpinner from "../Elements/Loading/LoadingSpinner";
import JadwalModal from "./JadwalMapel/CreateEditMapel";

const JadwalMapel = () => {
  // State untuk data
  const [jadwalList, setJadwalList] = useState([]);
  const [mataPelajaran, setMataPelajaran] = useState([]);
  const [kelasData, setKelasData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" atau "edit"
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  const hariMapping = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
  };

  const renderTableHeader = () => (
    <thead className="bg-gray-100">
      <tr>
        <th className="border p-2">Hari</th>
        <th className="border p-2">Waktu</th>
        {Object.values(kelasData).map((kelas) => (
          <th key={kelas.id} className="border p-2">
            {kelas.nama_kelas}
          </th>
        ))}
      </tr>
    </thead>
  );

  const sortedHari = useMemo(
    () =>
      Object.entries(hariMapping)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {}),
    []
  );

  // Tabel keterangan kode mapel
  const renderKeteranganMapel = () => (
    <div className="mt-4 p-4 border rounded">
      <h3 className="font-bold mb-2">Keterangan Kode Mata Pelajaran:</h3>
      <div className="grid grid-cols-3 gap-4">
        {mataPelajaran.map((mapel) => (
          <div key={mapel.id}>
            {mapel.id} = {mapel.nama_pelajaran}
          </div>
        ))}
      </div>
    </div>
  );

  const fetchData = async () => {
    try {
      console.log("Memulai fetch data jadwal...");

      // Fetch jadwal
      const jadwalResponse = await axiosClient.get("/jadwal");
      console.log("Data jadwal berhasil:", {
        total: jadwalResponse.data.data.length,
        data: jadwalResponse.data.data,
      });
      const jadwalData = jadwalResponse.data.data;

      // Fetch mata pelajaran
      const mapelResponse = await axiosClient.get("/mata-pelajaran");
      console.log("Data mata pelajaran berhasil:", {
        total: mapelResponse.data.data.length,
        data: mapelResponse.data.data,
      });
      setMataPelajaran(mapelResponse.data.data);

      // Fetch kelas untuk setiap jadwal
      console.log("Memulai fetch data kelas...");
      const kelasPromises = jadwalData.map((jadwal) =>
        axiosClient.get(`/kelas/${jadwal.id_kelas}`)
      );
      const kelasResponses = await Promise.all(kelasPromises);
      const kelasMap = {};
      kelasResponses.forEach((response, index) => {
        kelasMap[jadwalData[index].id_kelas] = response.data.data;
      });
      console.log("Data kelas berhasil didapat:", kelasMap);
      setKelasData(kelasMap);

      setJadwalList(jadwalData);
      console.log("Semua data berhasil dimuat!");
    } catch (err) {
      console.error("Error saat fetch data:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedJadwal(null);
    setShowModal(true);
  };

  const handleEdit = (jadwal) => {
    setModalMode("edit");
    setSelectedJadwal(jadwal);
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      console.log("📝 Memproses permintaan:", {
        mode: modalMode,
        data: formData,
      });

      if (modalMode === "add") {
        const response = await axiosClient.post("/jadwal", formData);
        console.log("✅ Jadwal berhasil ditambahkan:", {
          status: response.status,
          data: response.data,
        });
      } else {
        const response = await axiosClient.put(
          `/jadwal/${selectedJadwal.id}`,
          formData
        );
        console.log("✅ Jadwal berhasil diupdate:", {
          id: selectedJadwal.id,
          status: response.status,
          data: response.data,
        });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("❌ Error saat menyimpan jadwal:", {
        mode: modalMode,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      try {
        console.log("🗑️ Menghapus jadwal:", { id });
        const response = await axiosClient.delete(`/jadwal/${id}`);
        console.log("✅ Jadwal berhasil dihapus:", {
          id,
          status: response.status,
          data: response.data,
        });
        fetchData();
      } catch (err) {
        console.error("❌ Error saat menghapus jadwal:", {
          id,
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Jadwal Mata Pelajaran</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Tambah Jadwal
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          {renderTableHeader()}
          <tbody>
            {Object.entries(sortedHari).map(([idHari, namaHari]) => {
              const uniqueJadwal = jadwalList
                .filter((jadwal) => jadwal.id_hari === parseInt(idHari))
                .filter(
                  (jadwal, index, self) =>
                    self.findIndex((j) => j.jam_mulai === jadwal.jam_mulai) ===
                    index
                );

              return uniqueJadwal.map((jadwal) => (
                <tr key={`${idHari}-${jadwal.jam_mulai}`}>
                  <td className="border p-2 text-center">{namaHari}</td>
                  <td className="border p-2 text-center">
                    {jadwal.jam_mulai} - {jadwal.jam_selesai}
                  </td>

                  {Object.values(kelasData).map((kelas) => {
                    const currentJadwal = jadwalList.find(
                      (j) =>
                        j.id_hari === parseInt(idHari) &&
                        j.id_kelas === kelas.id &&
                        j.jam_mulai === jadwal.jam_mulai
                    );
                    return (
                      <td
                        key={kelas.id}
                        className="border p-2 text-center relative group"
                      >
                        {currentJadwal ? (
                          <>
                            <span>{currentJadwal.id_mata_pelajaran}</span>
                            <div className="hidden group-hover:flex absolute right-0 top-0 gap-1">
                              <button
                                onClick={() => handleEdit(currentJadwal)}
                                className="p-1 bg-blue-500 text-white rounded-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(currentJadwal.id)}
                                className="p-1 bg-red-500 text-white rounded-sm"
                              >
                                Hapus
                              </button>
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
      {renderKeteranganMapel()}

      <JadwalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        jadwalData={selectedJadwal}
        mode={modalMode}
        mataPelajaran={mataPelajaran}
        kelasData={kelasData}
      />
    </div>
  );
};

export default JadwalMapel;
