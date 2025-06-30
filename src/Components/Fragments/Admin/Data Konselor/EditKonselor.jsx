import { useState, useEffect } from "react";

const EditKonselor = ({ isOpen, onClose, guru, subjects, onSubmit }) => {
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
    if (guru) {
      setFormData({
        id: guru.id,
        nip: guru.nip,
        nama: guru.nama,
        jenis_kelamin: guru.jenis_kelamin,
        tanggal_lahir: guru.tanggal_lahir,
        alamat: guru.alamat,
        no_telp: guru.no_telp,
      });
    }
  }, [guru]);

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
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Edit Data Konselor
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* NIP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              NIP
            </label>
            <div className="relative">
              <input
                type="text"
                name="nip"
                value={formData.nip}
                readOnly
                className="block w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 pointer-events-none select-none cursor-not-allowed transition-all duration-300"
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

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              required
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 transition-colors duration-300"
            />
          </div>

          {/* Nama */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 transition-colors duration-300"
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jenis Kelamin
            </label>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              required
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 transition-colors duration-300"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              No. Telepon
            </label>
            <input
              type="tel"
              name="no_telp"
              value={formData.no_telp}
              onChange={handleChange}
              required
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 transition-colors duration-300"
            />
          </div>

          {/* Alamat */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
              rows="2"
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 transition-colors duration-300"
            />
          </div>

          {/* Tombol */}
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

export default EditKonselor;
