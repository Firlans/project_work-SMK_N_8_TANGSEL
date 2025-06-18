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
      <div className="bg-white p-6 w-full max-w-lg rounded shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">
          {defaultData ? "Edit Wali Murid" : "Tambah Wali Murid"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block">Nama Siswa</label>
            <select
              name="id_siswa"
              value={formData.id_siswa}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map((siswa) => (
                <option key={siswa.id} value={siswa.id}>
                  {siswa.nama_lengkap}
                </option>
              ))}
            </select>
            {errors.id_siswa && (
              <p className="text-red-600 text-sm">{errors.id_siswa[0]}</p>
            )}
          </div>

          <div>
            <label className="block">Nama Wali</label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.nama_lengkap && (
              <p className="text-red-600 text-sm">{errors.nama_lengkap[0]}</p>
            )}
          </div>

          <div>
            <label className="block">No Telepon</label>
            <input
              type="text"
              name="no_telp"
              value={formData.no_telp}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.no_telp && (
              <p className="text-red-600 text-sm">{errors.no_telp[0]}</p>
            )}
          </div>

          <div>
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Pilih Status --</option>
              <option value="ayah">Ayah</option>
              <option value="ibu">Ibu</option>
              <option value="wali murid">Wali Murid</option>
            </select>
            {errors.status && (
              <p className="text-red-600 text-sm">{errors.status[0]}</p>
            )}
          </div>

          <div>
            <label className="block">Alamat</label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            {errors.alamat && (
              <p className="text-red-600 text-sm">{errors.alamat[0]}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {defaultData ? "Update" : "Simpan"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
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
