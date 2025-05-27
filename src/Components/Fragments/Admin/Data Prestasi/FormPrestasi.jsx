import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";

const ModalPrestasi = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    id: "",
    nama_prestasi: "",
    deskripsi: "",
    status: "pengajuan",
    nama_foto: null,
    siswa_id: "",
  });

  const [siswaOptions, setSiswaOptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Mengambil data siswa untuk dropdown siswa
    const fetchSiswa = async () => {
      try {
        const res = await axiosClient.get("/siswa");
        console.log("✅ Data siswa berhasil dimuat:", res.data);
        const sortedSiswa = res.data.data.sort((a, b) =>
          a.nama_lengkap.localeCompare(b.nama_lengkap)
        );
        setSiswaOptions(sortedSiswa);
      } catch (err) {
        console.error("❌ Gagal mengambil data siswa:", err);
      }
    };

    fetchSiswa();

    if (initialData) {
      console.log("🔄 Mode Edit - Initial Data:", initialData);
      setFormData({
        id: initialData.id,
        nama_prestasi: initialData.nama_prestasi,
        deskripsi: initialData.deskripsi,
        status: initialData.status,
        nama_foto: initialData.nama_foto,
        siswa_id: initialData.siswa_id,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log("[FormPelanggaran] Field Change:", {
      name,
      value: files ? files[0] : value,
    });

    // Handle khusus untuk input file
    if (name === "nama_foto") {
      setFormData((prev) => ({ ...prev, nama_foto: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Persiapkan FormData untuk pengiriman
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      });

      // Append foto jika ada
      if (formData.nama_foto) {
        form.append("nama_foto", formData.nama_foto);
      }

      let response;

      // Handle update data
      if (initialData) {
        response = await axiosClient.put(
          `/prestasi/${initialData.id}`,
          form, // Kirim object langsung, bukan FormData
          {
            headers: { "Content-Type": "application/json" },
            nama_prestasi: formData.nama_prestasi,
            deskripsi: formData.deskripsi,
            status: formData.status,
            siswa_id: formData.siswa_id,
          }
        );
      } else {
        response = await axiosClient.post("/prestasi", form);
      }
      console.log("API Response:", response.data);
      onSuccess();
    } catch (error) {
      console.error(
        "Error saving user:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
          <h2 className="text-xl font-bold mb-4">
            {initialData ? "Edit" : "Tambah"}
          </h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">Nama Prestasi</label>
              <input
                type="text"
                name="nama_prestasi"
                value={formData.nama_prestasi}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Deskripsi</label>
              <input
                type="text"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="pengajuan">Pengajuan</option>
                <option value="ditolak">Ditolak</option>
                <option value="disetujui">Disetujui</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Siswa</label>
              <select
                id="siswa_id"
                name="siswa_id"
                value={formData.siswa_id}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Pilih siswa...</option>
                {siswaOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama_lengkap}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Foto</label>
              <input
                id="nama_foto"
                type="file"
                name="nama_foto"
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalPrestasi;
