import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import { usePrestasiForm } from "./usePrestasiForm"; // Pastikan path ini benar

const ModalPrestasi = ({ isOpen, onClose, onSuccess, initialData }) => {
  const {
    formData,
    siswaOptions,
    previewImage,
    backendError,
    validationErrors,
    loading,
    handleChange,
    handleSubmit,
    getUserRole,
  } = usePrestasiForm(isOpen, initialData, () => {
    onSuccess();
    onClose();
  });

  if (!isOpen) return null;

  const role = getUserRole();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all duration-300">
      {/* Loading Spinner di tengah modal */}
      {loading && (
        <LoadingSpinner
          text={initialData ? "Menyimpan perubahan..." : "Menambah data..."}
        />
      )}

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg shadow-lg relative transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white transition-colors">
          {initialData ? "Edit Poin Positif" : "Tambah Poin Positif"}
        </h2>

        {/* Tampilkan error dari backend (jika ada) */}
        {backendError && (
          <p className="text-red-500 text-sm mb-3 p-2 bg-red-100 dark:bg-red-900 rounded">
            {backendError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Jenis Poin Positif"
            name="nama_prestasi"
            placeholder="Contoh: Menjuarai lomba matematika tingkat nasional"
            value={formData.nama_prestasi}
            onChange={handleChange}
            error={validationErrors.nama_prestasi} // Meneruskan error
          />

          <InputField
            label="Deskripsi"
            name="deskripsi"
            placeholder="Contoh: Menjuarai lomba matematika tingkat nasional"
            value={formData.deskripsi}
            onChange={handleChange}
            isTextArea={true} // Memberi tahu InputField untuk merender textarea
            error={validationErrors.deskripsi} // Meneruskan error
          />

          {(role === "admin" || role === "conselor") && (
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { label: "Pengajuan", value: "pengajuan" },
                { label: "Disetujui", value: "disetujui" },
                { label: "Ditolak", value: "ditolak" },
              ]}
              error={validationErrors.status} // Meneruskan error
            />
          )}

          <SelectField
            label="Siswa"
            name="siswa_id"
            value={formData.siswa_id}
            onChange={handleChange}
            options={siswaOptions.map((s) => ({
              label: s.nama_lengkap,
              value: s.id,
            }))}
            disabled={!!initialData} // Siswa tidak bisa diganti di mode edit
            error={validationErrors.siswa_id} // Meneruskan error
          />

          {/* Bukti Foto Input Field */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Bukti Foto
            </label>
            <input
              type="file"
              name="nama_foto"
              accept="image/jpeg, image/png, image/gif, image/webp" // Hanya jenis file yang diizinkan
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded transition-all duration-300
                ${
                  validationErrors.nama_foto
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }
                dark:bg-gray-800 dark:text-white`}
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
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white dark:text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
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

const InputField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  disabled,
  isTextArea,
  error,
}) => (
  <div>
    <label className="block text-sm text-gray-700 dark:text-gray-300">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows="3" // Default rows for textarea
        className={`w-full border px-3 py-2 rounded mt-1 transition-all duration-300 resize-none
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
          dark:bg-gray-800 dark:text-white`}
        required
      />
    ) : (
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border px-3 py-2 rounded mt-1 transition-all duration-300
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
          dark:bg-gray-800 dark:text-white`}
        required
      />
    )}
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled,
  error,
}) => (
  <div>
    <label className="block text-sm text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border px-3 py-2 rounded mt-1 transition-all duration-300
        ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
        dark:bg-gray-800 dark:text-white`}
      required
    >
      <option value="">-- Pilih --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default ModalPrestasi;
