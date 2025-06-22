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
      console.log("[EditSiswa] Initial Form Data:", formValues);
      setFormData(formValues);
    }
  }, [siswa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("[EditSiswa] Field Change:", { name, value });
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[EditSiswa] Submitting Form Data:", formData);
    onSubmit(formData);
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
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 pointer-events-none select-none cursor-not-allowed transition-all duration-300"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
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
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all"
            />
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
