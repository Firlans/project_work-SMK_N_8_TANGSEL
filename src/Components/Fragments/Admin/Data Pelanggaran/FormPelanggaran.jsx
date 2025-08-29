import { usePelanggaranForm } from "./usePelanggaranForm";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";

const ModalPelanggaran = ({ isOpen, onClose, onSuccess, initialData }) => {
  const {
    formData,
    handleChange,
    previewImage,
    siswaList,
    getUserRole,
    isEdit,
    isSaving, // Ambil state isSaving dari hook
    isFetchingSiswa, // Ambil state isFetchingSiswa dari hook
    backendError, // Ambil error dari hook
    validationErrors, // Ambil validationErrors dari hook
    handleSubmit: hookHandleSubmit, // Ganti nama agar tidak konflik dengan handleSubmit lokal
    jenisPelanggaranList,
    isFetchingJenis,
  } = usePelanggaranForm(initialData, isOpen);

  const handleSubmit = async (e) => {
    // Memanggil handleSubmit dari hook, meneruskan e dan onSuccess sebagai callback
    await hookHandleSubmit(e, () => {
      onSuccess();
      onClose();
    });
  };

  if (!isOpen) return null;

  const role = getUserRole();

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors duration-300">
      {(isSaving || isFetchingSiswa) && (
        <LoadingSpinner
          text={isSaving ? "Menyimpan data..." : "Memuat data siswa..."}
        />
      )}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-xl shadow-lg relative transition-all duration-300 ease-in-out">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white transition-colors">
          {isEdit ? "Edit Poin Negatif" : "Tambah Poin Negatif"}
        </h2>

        {/* Tampilkan error umum dari backend jika ada */}
        {backendError && (
          <p className="text-red-500 text-sm mb-3 p-2 bg-red-100 dark:bg-red-900 rounded">
            {backendError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Terlapor (Nama Siswa) */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors mb-1">
              Nama Siswa
            </label>
            <select
              name="terlapor"
              value={formData.terlapor}
              onChange={handleChange}
              disabled={isEdit || isFetchingSiswa} // Disable saat edit atau sedang fetch siswa
              required
              className={`w-full border px-3 py-2 rounded transition-all
                ${
                  validationErrors.terlapor
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100`}
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama_lengkap}
                </option>
              ))}
            </select>
            {validationErrors.terlapor && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.terlapor}
              </p>
            )}
          </div>

          {/* Jenis Pelanggaran */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors mb-1">
              Nama Poin Negatif
            </label>
            <input
              type="text"
              name="nama_pelanggaran"
              value={formData.nama_pelanggaran}
              onChange={handleChange}
              disabled={isEdit}
              required
              className={`w-full border px-3 py-2 rounded transition-all
                ${
                  validationErrors.nama_pelanggaran
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100`}
            />
            {validationErrors.nama_pelanggaran && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.nama_pelanggaran}
              </p>
            )}
          </div>

          {/* Jenis Pelanggaran */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors mb-1">
              Jenis Pelanggaran
            </label>
            <select
              name="jenis_pelanggaran_id"
              value={formData.jenis_pelanggaran_id}
              onChange={handleChange}
              required
              className={`w-full border px-3 py-2 rounded transition-all
                ${
                  validationErrors.jenis_pelanggaran_id
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100`}
            >
              <option value="">
                {isFetchingJenis
                  ? "Memuat data..."
                  : "-- Pilih Jenis Pelanggaran --"}
              </option>
              {jenisPelanggaranList.map((jp) => (
                <option key={jp.id} value={jp.id}>
                  {jp.nama_jenis} (Poin: {jp.poin})
                </option>
              ))}
            </select>
            {validationErrors.jenis_pelanggaran_id && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.jenis_pelanggaran_id}
              </p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors mb-1">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              rows="3" // Menambahkan rows untuk textarea
              className={`w-full border px-3 py-2 rounded transition-all resize-none
                ${
                  validationErrors.deskripsi
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100`}
            />
            {validationErrors.deskripsi && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.deskripsi}
              </p>
            )}
          </div>

          {/* Status - hanya admin/konselor */}
          {(role === "admin" || role === "conselor") && (
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors mb-1">
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
              {validationErrors.status && ( // Tambahkan validasi untuk status jika diperlukan
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.status}
                </p>
              )}
            </div>
          )}

          {/* Upload Bukti Foto */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 transition-colors mb-1">
              Bukti Foto
            </label>
            <input
              type="file"
              name="nama_foto"
              accept="image/jpeg, image/png, image/gif, image/webp" // Hanya jenis file yang diizinkan
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded transition-all
                ${
                  validationErrors.nama_foto
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100`}
            />
            {validationErrors.nama_foto && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.nama_foto}
              </p>
            )}
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
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white dark:text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
              disabled={isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPelanggaran;
