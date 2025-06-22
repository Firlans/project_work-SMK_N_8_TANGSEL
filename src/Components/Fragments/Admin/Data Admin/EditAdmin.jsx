import React, { useState, useEffect } from "react";

const EditAdmin = ({ isOpen, onClose, admin, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: "",
    nip: "",
    nama: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    alamat: "",
    no_telp: "",
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        id: admin.id,
        nip: admin.nip,
        nama: admin.nama,
        jenis_kelamin: admin.jenis_kelamin,
        tanggal_lahir: admin.tanggal_lahir,
        alamat: admin.alamat,
        no_telp: admin.no_telp,
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative top-20 mx-2 sm:mx-auto p-5 border border-gray-200 dark:border-gray-700 w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-900 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            Edit Data Admin
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 dark:text-gray-100 transition-colors duration-300"
        >
          {/* NIP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              NIP
            </label>
            <div className="relative">
              <input
                type="text"
                name="nip"
                value={formData.nip}
                readOnly
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 pr-10 pointer-events-none select-none cursor-not-allowed transition-all duration-300"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
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
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 transition-all duration-300"
            />
          </div>

          {/* Nama */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 transition-all duration-300"
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
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 transition-all duration-300"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* No Telp */}
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
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 transition-all duration-300"
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
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 transition-all duration-300"
              rows="2"
            />
          </div>

          {/* Buttons */}
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

export default EditAdmin;
