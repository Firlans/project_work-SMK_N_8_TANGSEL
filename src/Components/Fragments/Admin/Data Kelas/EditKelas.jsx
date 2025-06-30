import { useState } from "react";
import axiosClient from "../../../../axiosClient";

const EditKelas = ({ onClose, refreshData, initialData, siswaList }) => {
  const [form, setForm] = useState({
    nama_kelas: initialData?.nama_kelas || "",
    tingkat: initialData?.tingkat || "",
    ketua_kelas: initialData?.ketua_kelas || "",
  });
  const [error, setError] = useState("");
  const tingkatList = ["10", "11", "12"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (initialData) {
        await axiosClient.put(`/kelas/${initialData.id}`, form);
      } else {
        await axiosClient.post("/kelas", form);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
          {initialData ? "Edit Kelas" : "Tambah Kelas"}
        </h3>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mb-2 transition-colors duration-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Kelas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Nama Kelas
            </label>
            <input
              type="text"
              value={form.nama_kelas}
              onChange={(e) => setForm({ ...form, nama_kelas: e.target.value })}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded transition-all duration-300"
            />
          </div>

          {/* Tingkat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Tingkat
            </label>
            <select
              value={form.tingkat}
              onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded transition-all duration-300"
            >
              <option value="">- Pilih Tingkat -</option>
              {tingkatList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Ketua Kelas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Ketua Kelas
            </label>
            <select
              value={form.ketua_kelas || ""}
              onChange={(e) =>
                setForm({ ...form, ketua_kelas: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded transition-all duration-300"
            >
              <option value="">- Pilih -</option>
              {siswaList.map((siswa) => (
                <option key={siswa.id} value={siswa.id}>
                  {siswa.nama_lengkap}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white dark:text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
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
