import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";

const FormWaliMurid = ({ siswaList, defaultData, onClose }) => {
  const [formData, setFormData] = useState({
    id_siswa: "",
    nama_lengkap: "",
    no_telp: "",
    email: "",
    status: "",
    alamat: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Untuk error dari backend
  const [validationErrors, setValidationErrors] = useState({}); // Untuk error validasi frontend

  useEffect(() => {
    if (defaultData) {
      setFormData(defaultData);
    }
    // Bersihkan error saat modal dibuka/defaultData berubah
    setErrors({});
    setValidationErrors({});
  }, [defaultData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Hapus error spesifik saat user mulai mengetik lagi
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Fungsi validasi front-end yang diperbarui (hanya no_telp dan email)
  const validateForm = () => {
    let newValidationErrors = {};
    const phoneRegex = /^\d+$/; // Hanya angka
    const minPhoneLength = 4; // Minimal 4 angka
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validasi email dasar

    // Validasi Nomor Telepon
    if (!formData.no_telp) {
      newValidationErrors.no_telp = "Nomor Telepon tidak boleh kosong.";
    } else if (!phoneRegex.test(formData.no_telp)) {
      newValidationErrors.no_telp = "Nomor Telepon hanya boleh berisi angka.";
    } else if (formData.no_telp.length < minPhoneLength) {
      newValidationErrors.no_telp = `Nomor Telepon minimal ${minPhoneLength} angka.`;
    }

    // Validasi Email
    if (!formData.email) {
      newValidationErrors.email = "Email tidak boleh kosong.";
    } else if (!emailRegex.test(formData.email)) {
      newValidationErrors.email = "Format Email tidak valid.";
    }

    // Validasi field wajib lainnya (jika Anda ingin tetap ada)
    if (!formData.id_siswa) {
      newValidationErrors.id_siswa = "Nama Siswa tidak boleh kosong.";
    }
    if (!formData.nama_lengkap) {
      newValidationErrors.nama_lengkap = "Nama Wali tidak boleh kosong.";
    }
    if (!formData.status) {
      newValidationErrors.status = "Status tidak boleh kosong.";
    }
    if (!formData.alamat) {
      newValidationErrors.alamat = "Alamat tidak boleh kosong.";
    }

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0; // true jika tidak ada error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi front-end
    if (!validateForm()) {
      alert("Mohon periksa kembali input Anda. Ada kesalahan.");
      return;
    }

    setLoading(true);
    setErrors({}); // Bersihkan error dari backend sebelum request baru
    try {
      if (defaultData) {
        await axiosClient.put(`/wali-murid/${defaultData.id}`, formData);
      } else {
        await axiosClient.post("/wali-murid", formData);
      }
      onClose(); // Tutup modal setelah berhasil
      // Jika perlu me-refresh data di parent, panggil onSuccess di parent
    } catch (err) {
      if (err.response && err.response.status === 422) {
        // Ini adalah error validasi dari Laravel/backend
        setErrors(err.response.data.errors || err.response.data.message);
        alert("Gagal menyimpan. Periksa kembali input Anda.");
      } else {
        alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      {loading && <LoadingSpinner text="Menyimpan data..." />}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative transition-all duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {defaultData ? "Edit Wali Murid" : "Tambah Wali Murid"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nama Siswa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Siswa
            </label>
            <select
              name="id_siswa"
              value={formData.id_siswa}
              onChange={handleChange}
              required
              disabled={!!defaultData} // Disable jika dalam mode edit
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300 ${
                errors.id_siswa || validationErrors.id_siswa
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map(
                (
                  siswa // Menggunakan siswaList tanpa filter id_wali_murid
                ) => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.nama_lengkap}
                  </option>
                )
              )}
            </select>
            {(errors.id_siswa || validationErrors.id_siswa) && (
              <p className="text-red-600 text-sm mt-1">
                {errors.id_siswa?.[0] || validationErrors.id_siswa}
              </p>
            )}
          </div>

          {/* Nama Wali */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Wali
            </label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              required
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300 ${
                errors.nama_lengkap || validationErrors.nama_lengkap
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {(errors.nama_lengkap || validationErrors.nama_lengkap) && (
              <p className="text-red-600 text-sm mt-1">
                {errors.nama_lengkap?.[0] || validationErrors.nama_lengkap}
              </p>
            )}
          </div>

          {/* No Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              No Telepon
            </label>
            <input
              type="text" // Ganti ke type="tel" jika ingin keyboard numerik di mobile
              name="no_telp"
              value={formData.no_telp}
              onChange={handleChange}
              required
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300 ${
                errors.no_telp || validationErrors.no_telp
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {(errors.no_telp || validationErrors.no_telp) && (
              <p className="text-red-600 text-sm mt-1">
                {errors.no_telp?.[0] || validationErrors.no_telp}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300 ${
                errors.email || validationErrors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {(errors.email || validationErrors.email) && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email?.[0] || validationErrors.email}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300 ${
                errors.status || validationErrors.status
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <option value="">-- Pilih Status --</option>
              <option value="ayah">Ayah</option>
              <option value="ibu">Ibu</option>
              <option value="wali murid">Wali Murid</option>
            </select>
            {(errors.status || validationErrors.status) && (
              <p className="text-red-600 text-sm mt-1">
                {errors.status?.[0] || validationErrors.status}
              </p>
            )}
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
              className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300 ${
                errors.alamat || validationErrors.alamat
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              rows="2"
            />
            {(errors.alamat || validationErrors.alamat) && (
              <p className="text-red-600 text-sm mt-1">
                {errors.alamat?.[0] || validationErrors.alamat}
              </p>
            )}
          </div>

          {/* Action Buttons */}
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

export default FormWaliMurid;
