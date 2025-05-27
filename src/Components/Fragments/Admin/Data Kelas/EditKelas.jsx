import React, { useState } from "react";
import axiosClient from "../../../../axiosClient";

const EditKelas = ({ onClose, refreshData, initialData, siswaList }) => {
  const [form, setForm] = useState({
    nama_kelas: initialData?.nama_kelas || "",
    tingkat: initialData?.tingkat || "",
    ketua_kelas: initialData?.ketua_kelas || "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (initialData) {
        await axiosClient.put(`/kelas/${initialData.id}`, form);
        console.log("Data kelas berhasil diperbarui:", form);
      } else {
        await axiosClient.post("/kelas", form);
        console.log("Data kelas berhasil ditambahkan:", form);
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
        <h3 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Kelas" : "Tambah Kelas"}
        </h3>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Nama Kelas</label>
            <input
              type="text"
              value={form.nama_kelas}
              onChange={(e) => setForm({ ...form, nama_kelas: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Tingkat</label>
            <input
              type="text"
              value={form.tingkat}
              onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Ketua Kelas</label>
            <select
              value={form.ketua_kelas || ""}
              onChange={(e) =>
                setForm({ ...form, ketua_kelas: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">- Pilih -</option>
              {siswaList.map((siswa) => (
                <option key={siswa.id} value={siswa.id}>
                  {siswa.nama_lengkap}
                </option>
              ))}
            </select>
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

export default EditKelas;
