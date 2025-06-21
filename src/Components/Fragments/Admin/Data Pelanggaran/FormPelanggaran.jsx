import { usePelanggaranForm } from "./usePelanggaranForm";
import axiosClient from "../../../../axiosClient";

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
      console.error("Gagal simpan pelanggaran:", err);
    }
  };

  if (!isOpen) return null;

  const role = getUserRole();

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Pelanggaran" : "Tambah Pelanggaran"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Terlapor */}
          <div>
            <label className="block text-sm">Terlapor</label>
            <select
              name="terlapor"
              value={formData.terlapor}
              onChange={handleChange}
              disabled={isEdit}
              required
              className="w-full border px-3 py-2 rounded"
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
            <label className="block text-sm">Jenis Pelanggaran</label>
            <input
              type="text"
              name="nama_pelanggaran"
              value={formData.nama_pelanggaran}
              onChange={handleChange}
              disabled={isEdit}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="block text-sm">Bukti Foto</label>
            <input
              type="file"
              name="nama_foto"
              accept="image/*"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          {/* Status untuk admin/conselor */}
          {(role === "admin" || role === "conselor") && (
            <div>
              <label className="block text-sm">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="pengajuan">Pengajuan</option>
                <option value="proses">Proses</option>
                <option value="ditolak">Ditolak</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
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
