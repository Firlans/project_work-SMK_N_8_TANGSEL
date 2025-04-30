import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import ModalForm from "../../Elements/Form/ModalForm";
import FormPresensi from "./FormPresensi";
import { formatTanggal } from "../../../utils/dateFormatter";

const PresensiTable = ({ siswaId, mapelId }) => {
  const [presensi, setPresensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: "",
    status: "hadir",
    keterangan: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPresensi, setSelectedPresensi] = useState(null);

  const statusOptions = ["hadir", "sakit", "izin", "alpha", "OJT", "OJK"];

  useEffect(() => {
    fetchPresensi();
  }, [siswaId, mapelId]);

  const fetchPresensi = async () => {
    try {
      const response = await axiosClient.get(
        `/absen/mata-pelajaran?id_siswa=${siswaId}&id_mata_pelajaran=${mapelId}`
      );
      console.log("Response Data:", response.data); // Debug response data
      setPresensi(response.data.data);
    } catch (err) {
      console.error("Error fetching presensi:", err); // Debug error
      setError("Gagal memuat data presensi");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleEdit = (presensi) => {
    setSelectedPresensi(presensi);
    setFormData({
      tanggal: presensi.tanggal,
      status: presensi.status.toLowerCase(),
      keterangan: presensi.keterangan || "",
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode) {
        response = await axiosClient.put(`/absen/${selectedPresensi.id}`, {
          id_siswa: siswaId,
          id_jadwal: mapelId,
          ...formData,
        });
        console.log("Update Response:", response.data); // Debug update response
      } else {
        response = await axiosClient.post("/absen", {
          id_siswa: siswaId,
          id_jadwal: mapelId,
          ...formData,
        });
        console.log("Create Response:", response.data); // Debug create response
      }
      fetchPresensi();
      setShowForm(false);
      setFormData({ tanggal: "", status: "hadir", keterangan: "" });
      setIsEditMode(false);
      setSelectedPresensi(null);
    } catch (err) {
      console.error("Error submitting presensi:", err); // Debug submit error
      setError("Gagal menyimpan data presensi");
    }
  };

  const handleDelete = async (id) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Apakah anda yakin ingin menghapus data presensi ini?"
    );

    if (confirmed) {
      try {
        const response = await axiosClient.delete(`/absen/${id}`);
        console.log("Delete Response:", response.data); // Debug delete response

        // Refresh data after successful deletion
        fetchPresensi();
      } catch (err) {
        console.error("Error deleting presensi:", err); // Debug delete error
        setError("Gagal menghapus data presensi");
      }
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => {
          setShowForm(true);
          setIsEditMode(false);
          setFormData({ tanggal: "", status: "hadir", keterangan: "" });
        }}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Tambah Presensi
      </button>

      <ModalForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setIsEditMode(false);
          setSelectedPresensi(null);
        }}
        title={isEditMode ? "Edit Presensi" : "Tambah Presensi"}
      >
        <FormPresensi
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          statusOptions={statusOptions}
          isEdit={isEditMode}
        />
      </ModalForm>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded-lg"
        >
          <div>
            <label className="block mb-1">Tanggal</label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) =>
                setFormData({ ...formData, tanggal: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Keterangan</label>
            <textarea
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Simpan
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Pertemuan</th>
              <th className="px-6 py-3 text-left">Tanggal</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Keterangan</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {presensi.map((p, index) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{formatTanggal(p.tanggal)}</td>
                <td className="px-6 py-4">{p.status}</td>
                <td className="px-6 py-4">{p.keterangan}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresensiTable;
