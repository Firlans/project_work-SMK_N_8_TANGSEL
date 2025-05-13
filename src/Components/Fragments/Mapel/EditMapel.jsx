import { useState } from "react";
import axiosClient from "../../../axiosClient";

const EditMapel = ({ onClose, refreshData, initialData }) => {
  const [form, setForm] = useState({
    nama_pelajaran: initialData?.nama_pelajaran || "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (initialData) {
        await axiosClient.put(
          `/mata-pelajaran/${initialData.id}?nama_pelajaran=${form.nama_pelajaran}`,
          form
        );
        console.log("Data mapel berhasil diperbarui:", form);
      } else {
        await axiosClient.post("/mata-pelajaran", form);
        console.log("Data mapel berhasil ditambahkan:", form);
      }
      refreshData();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message;
      if (typeof msg === "object") {
        const messages = Object.values(msg).flat().join(", ");
        setError(messages);
      } else {
        setError(msg || "Terjadi kesalahan");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {initialData ? "Edit Mapel" : "Tambah Mapel"}
        </h3>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Nama Mata Pelajaran</label>
            <input
              type="text"
              name="nama_pelajaran"
              value={form.nama_pelajaran}
              onChange={(e) =>
                setForm({ ...form, nama_pelajaran: e.target.value })
              }
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMapel;
