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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        <h2 className="text-xl font-bold mb-4">
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

const InputField = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border px-3 py-2 rounded"
      required
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, disabled }) => (
  <div>
    <label className="block text-sm">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border px-3 py-2 rounded"
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
