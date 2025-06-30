import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import GenerateLoadingModal from "../../../Elements/Loading/GenerateLoadingModal";

const FormPertemuan = ({ isOpen, onClose, data, idJadwal, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [jumlah, setJumlah] = useState(0);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateProgress, setGenerateProgress] = useState("");
  const [editForm, setEditForm] = useState({
    nama_pertemuan: "",
    tanggal: "",
  });
  const [error, setError] = useState(false);

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
      await axiosClient.put(`/pertemuan/${data.id}`, {
        ...editForm,
        id_jadwal: idJadwal,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // generate banyak pertemuan otomatis
  const handleGenerate = async () => {
    if (jumlah <= 0) return;
    setShowGenerateModal(true);

    try {
      const today = new Date();

      // looping untuk membuat banyak pertemuan
      for (let i = 0; i < jumlah; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i * 7);
        const dateStr = date.toISOString().split("T")[0];

        await axiosClient.post("/pertemuan", {
          nama_pertemuan: `Pertemuan ${i + 1}`,
          tanggal: dateStr,
          id_jadwal: idJadwal,
        });

        setGenerateProgress(`Membuat pertemuan ke-${i + 1} dari ${jumlah}`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(true);
    } finally {
      setShowGenerateModal(false);
      setGenerateProgress("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
          {data ? "Edit Pertemuan" : "Tambah Pertemuan"}
        </h2>

        {data ? (
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
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Jumlah Pertemuan
            </label>
            <input
              type="text"
              min="1"
              value={jumlah}
              onChange={(e) =>
                setJumlah(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Masukkan jumlah (contoh: 10)"
            />

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={handleGenerate}
                className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white dark:text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </>
        )}
      </div>
      {showGenerateModal && (
        <GenerateLoadingModal progress={generateProgress} />
      )}
    </div>
  );
};

export default FormPertemuan;
