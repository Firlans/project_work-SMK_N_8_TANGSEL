import { usePelanggaranForm } from "./usePelanggaranForm";
import axiosClient from "../../../../axiosClient";
import { useState } from "react";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";

const ModalPelanggaran = ({ isOpen, onClose, onSuccess, initialData }) => {
  const {
    formData,
    handleChange,
    previewImage,
    siswaList,
    userPrivilege,
    getUserRole,
    isEdit,
  } = usePelanggaranForm(initialData, isOpen);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userPrivilege?.id_user) {
      alert("Pelapor tidak ditemukan. Silakan login ulang.");
      return;
    }

    const form = new FormData();
    form.append("pelapor", isEdit ? formData.pelapor : userPrivilege?.id_user);
    form.append("terlapor", formData.terlapor);
    form.append("nama_pelanggaran", formData.nama_pelanggaran);
    form.append("deskripsi", formData.deskripsi);
    form.append("status", formData.status || "pengajuan");

    if (formData.nama_foto) {
      form.append("bukti_gambar", formData.nama_foto);
    }

    setLoading(true);
    try {
      if (initialData) {
        await axiosClient.post(
          `/pelanggaran/${initialData.id}?_method=PUT`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axiosClient.post("/pelanggaran", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSuccess();
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const role = getUserRole();

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors duration-300">
      {loading && <LoadingSpinner text="Menyimpan data..." />}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-xl shadow-lg relative transition-all duration-300 ease-in-out">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white transition-colors">
          {isEdit ? "Edit Pelanggaran" : "Tambah Pelanggaran"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Terlapor */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors">
              Terlapor
            </label>
            <select
              name="terlapor"
              value={formData.terlapor}
              onChange={handleChange}
              disabled={isEdit}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 rounded transition-all"
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama_lengkap}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Pelanggaran */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors">
              Jenis Pelanggaran
            </label>
            <input
              type="text"
              name="nama_pelanggaran"
              value={formData.nama_pelanggaran}
              onChange={handleChange}
              disabled={isEdit}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 rounded transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 rounded transition-all"
            />
          </div>

          {/* Status - hanya admin/konselor */}
          {(role === "admin" || role === "conselor") && (
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 rounded transition-all"
                required
              >
                <option value="pengajuan">Pengajuan</option>
                <option value="proses">Proses</option>
                <option value="ditolak">Ditolak</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          )}

          {/* Upload */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors">
              Bukti Foto
            </label>
            <input
              type="file"
              name="nama_foto"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 rounded transition-all"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded border border-gray-300 dark:border-gray-600 transition-all"
              />
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2 mt-4">
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

export default ModalPelanggaran;
