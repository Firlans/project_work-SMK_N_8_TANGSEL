import React, { useState, useEffect } from "react";

const EditSiswa = ({ isOpen, onClose, siswa, kelas, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: "",
    user_id: "",
    nama_lengkap: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    alamat: "",
    no_telp: "",
    nisn: "",
    nis: "",
    semester: "",
    id_kelas: "",
  });
  // State untuk menyimpan pesan error
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (siswa) {
      const formValues = {
        id: siswa.id,
        user_id: siswa.user_id,
        nama_lengkap: siswa.nama_lengkap,
        jenis_kelamin: siswa.jenis_kelamin,
        tanggal_lahir: siswa.tanggal_lahir,
        alamat: siswa.alamat,
        no_telp: siswa.no_telp,
        nisn: siswa.nisn,
        nis: siswa.nis,
        semester: siswa.semester,
        id_kelas: siswa.id_kelas,
      };
      setFormData(formValues);
      setErrors({}); // Reset errors saat siswa berubah
    }
  }, [siswa]);

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
  };

  const validateForm = () => {
    let newErrors = {};
    const numericRegex = /^\d+$/; // Regex untuk hanya angka
    const minLength = 4; // Minimal 4 angka

    // Validasi NISN
    if (!numericRegex.test(formData.nisn)) {
      newErrors.nisn = "NISN hanya boleh berisi angka.";
    } else if (formData.nisn.length < minLength) {
      newErrors.nisn = `NISN minimal ${minLength} angka.`;
    }

    // Validasi NIS
    if (!numericRegex.test(formData.nis)) {
      newErrors.nis = "NIS hanya boleh berisi angka.";
    } else if (formData.nis.length < minLength) {
      newErrors.nis = `NIS minimal ${minLength} angka.`;
    }

    // Validasi No. Telepon
    if (!numericRegex.test(formData.no_telp)) {
      newErrors.no_telp = "Nomor Telepon hanya boleh berisi angka.";
    } else if (formData.no_telp.length < minLength) {
      newErrors.no_telp = `Nomor Telepon minimal ${minLength} angka.`;
    }

    setErrors(newErrors);
    // Mengembalikan true jika tidak ada error, false jika ada error
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Jika ada error, tampilkan alert umum
      alert("Mohon periksa kembali data Anda. Ada kesalahan input.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      {" "}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors">
            Edit Data Siswa
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {[
            ["nisn", "NISN"],
            ["nis", "NIS"],
          ].map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                {label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-300 ${
                    errors[field]
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                )}
              </div>
            </div>
          ))}

          {/* Nama Lengkap */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              required
              maxLength={255}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all duration-300"
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Jenis Kelamin
            </label>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all"
            />
          </div>

          {/* Alamat */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
              rows="2"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all"
            />
          </div>

          {/* No Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              No. Telepon
            </label>
            <input
              type="tel"
              name="no_telp"
              value={formData.no_telp}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all ${
                errors.no_telp
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {errors.no_telp && (
              <p className="text-red-500 text-xs mt-1">{errors.no_telp}</p>
            )}
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Semester
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
            >
              <option value="">Pilih Semester</option>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kelas
            </label>
            <select
              name="id_kelas"
              value={formData.id_kelas}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
            >
              <option value="">Pilih Kelas</option>
              {Object.values(kelas)
                .sort((a, b) => a.nama_kelas.localeCompare(b.nama_kelas))
                .map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kelas}
                  </option>
                ))}
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="col-span-2 mt-4 flex justify-end space-x-3">
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

export default EditSiswa;
