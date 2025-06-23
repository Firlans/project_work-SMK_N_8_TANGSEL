import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import { usePrestasiForm } from "./usePrestasiForm";

const ModalPrestasi = ({ isOpen, onClose, onSuccess, initialData }) => {
  const {
    formData,
    siswaOptions,
    previewImage,
    error,
    loading,
    handleChange,
    handleSubmit,
  } = usePrestasiForm(isOpen, initialData, () => {
    onSuccess();
    onClose();
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all duration-300">
      {loading && <LoadingSpinner text="Menyimpan data..." />}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg shadow-lg relative transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white transition-colors">
          {initialData ? "Edit Prestasi" : "Tambah Prestasi"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nama Prestasi"
            name="nama_prestasi"
            value={formData.nama_prestasi}
            onChange={handleChange}
            disabled={!!initialData}
          />

          <InputField
            label="Deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
          />

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
          />

          <SelectField
            label="Siswa"
            name="siswa_id"
            value={formData.siswa_id}
            onChange={handleChange}
            options={siswaOptions.map((s) => ({
              label: s.nama_lengkap,
              value: s.id,
            }))}
            disabled={!!initialData}
          />

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Bukti Foto
            </label>
            <input
              type="file"
              name="nama_foto"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded transition-all duration-300"
            />
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

const InputField = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded mt-1 transition-all duration-300"
      required
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, disabled }) => (
  <div>
    <label className="block text-sm text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded mt-1 transition-all duration-300"
      required
    >
      <option value="">-- Pilih --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default ModalPrestasi;
