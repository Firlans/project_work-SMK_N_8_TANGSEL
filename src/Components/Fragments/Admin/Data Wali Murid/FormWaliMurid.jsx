// FormWaliMurid.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";

const FormWaliMurid = ({ siswaList, defaultData, onClose }) => {
  const [formData, setFormData] = useState({
    id_siswa: "",
    nama_lengkap: "",
    no_telp: "",
    email: "",
    status: "",
    alamat: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (defaultData) setFormData(defaultData);
  }, [defaultData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (defaultData) {
        await axiosClient.put(`/wali-murid/${defaultData.id}`, formData);
      } else {
        await axiosClient.post("/wali-murid", formData);
      }
      onClose();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.message);
      } else {
        alert("Terjadi kesalahan.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
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
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 transition-colors duration-300"
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map((siswa) => (
                <option key={siswa.id} value={siswa.id}>
                  {siswa.nama_lengkap}
                </option>
              ))}
            </select>
            {errors.id_siswa && (
              <p className="text-red-600 text-sm mt-1">{errors.id_siswa[0]}</p>
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
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 transition-colors duration-300"
            />
            {errors.nama_lengkap && (
              <p className="text-red-600 text-sm mt-1">
                {errors.nama_lengkap[0]}
              </p>
            )}
          </div>

          {/* No Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              No Telepon
            </label>
            <input
              type="text"
              name="no_telp"
              value={formData.no_telp}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 transition-colors duration-300"
            />
            {errors.no_telp && (
              <p className="text-red-600 text-sm mt-1">{errors.no_telp[0]}</p>
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
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 transition-colors duration-300"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email[0]}</p>
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
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 transition-colors duration-300"
            >
              <option value="">-- Pilih Status --</option>
              <option value="ayah">Ayah</option>
              <option value="ibu">Ibu</option>
              <option value="wali murid">Wali Murid</option>
            </select>
            {errors.status && (
              <p className="text-red-600 text-sm mt-1">{errors.status[0]}</p>
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
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 transition-colors duration-300"
            />
            {errors.alamat && (
              <p className="text-red-600 text-sm mt-1">{errors.alamat[0]}</p>
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
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormWaliMurid;
