import { useState } from "react";
import axiosClient from "../../../../axiosClient";

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
      } else {
        await axiosClient.post("/mata-pelajaran", form);
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
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 w-full max-w-md rounded-xl shadow-lg transition-colors duration-300">
        <h3 className="text-xl font-bold mb-4 transition-colors duration-300">
          {initialData ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
        </h3>

        {error && (
          <p className="text-sm text-red-500 mb-2 transition-colors duration-300">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 transition-all duration-300"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Nama Mata Pelajaran
            </label>
            <input
              type="text"
              name="nama_pelajaran"
              value={form.nama_pelajaran}
              onChange={(e) =>
                setForm({ ...form, nama_pelajaran: e.target.value })
              }
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded-lg transition-all duration-300"
            />
          </div>

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

export default EditMapel;
