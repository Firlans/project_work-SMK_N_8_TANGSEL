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
      onSuccess(); // trigger refresh dari parent
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {data ? "Edit Pertemuan" : "Tambah Pertemuan"}
        </h2>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Pertemuan</label>
            <input
              type="text"
              name="nama_pertemuan"
              value={editForm.nama_pertemuan}
              onChange={(e) =>
                setEditForm({ ...editForm, nama_pertemuan: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={editForm.tanggal}
              onChange={(e) =>
                setEditForm({ ...editForm, tanggal: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
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
