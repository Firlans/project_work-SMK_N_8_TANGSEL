import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";

const FormPertemuan = ({ isOpen, onClose, data, idJadwal, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    nama_pertemuan: "",
    tanggal: "",
  });

  useEffect(() => {
    if (data) {
      setEditForm({
        nama_pertemuan: data.nama_pertemuan || "",
        tanggal: data.tanggal || "",
      });
    } else {
      setEditForm({ nama_pertemuan: "", tanggal: "" });
    }
  }, [data]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (data) {
        await axiosClient.put(`/pertemuan/${data.id}`, {
          ...editForm,
          id_jadwal: idJadwal,
        });
      } else {
        await axiosClient.post("/pertemuan", {
          ...editForm,
          id_jadwal: idJadwal,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Gagal menyimpan pertemuan:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
          {data ? "Edit Pertemuan" : "Tambah Pertemuan"}
        </h2>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Nama Pertemuan
            </label>
            <input
              type="text"
              name="nama_pertemuan"
              value={editForm.nama_pertemuan}
              onChange={(e) =>
                setEditForm({ ...editForm, nama_pertemuan: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded mt-1 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Tanggal
            </label>
            <input
              type="date"
              name="tanggal"
              value={editForm.tanggal}
              onChange={(e) =>
                setEditForm({ ...editForm, tanggal: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded mt-1 transition-all duration-300"
              required
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
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPertemuan;
