import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";

const FormPertemuan = ({ isOpen, onClose, data, idJadwal, onSuccess }) => {
  const [form, setForm] = useState({
    id: "",
    nama_pertemuan: "",
    tanggal: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      console.log("🔄 Mode Edit - Initial Data:", data);
      setForm({
        id: data.id || "",
        nama_pertemuan: data.nama_pertemuan || "",
        tanggal: data.tanggal || "",
      });
    } else {
      setForm({
        nama_pertemuan: "",
        tanggal: "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      id_jadwal: idJadwal,
    };

    try {
      if (data) {
        await axiosClient.put(`/pertemuan/${data.id}`, payload);
      } else {
        await axiosClient.post(`/pertemuan`, payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Gagal menyimpan pertemuan:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        sentData: payload,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">
          {data ? "Edit Pertemuan" : "Tambah Pertemuan"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Pertemuan</label>
            <input
              type="text"
              name="nama_pertemuan"
              value={form.nama_pertemuan}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

export default FormPertemuan;
