import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";

const ModalPelanggaran = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    id: "",
    nama_pelanggaran: "",
    deskripsi: "",
    status: "Pengajuan",
    pelapor: "",
    terlapor: "",
    nama_foto: null,
  });

  const [siswaOptions, setSiswaOptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Mengambil data siswa untuk dropdown terlapor
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

    // Mengambil data user yang sedang login untuk field pelapor
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get("/profile");
        console.log("✅ Data user berhasil dimuat:", res.data);
        // Hanya set pelapor jika tidak dalam mode edit
        if (!initialData) {
          setFormData((prev) => ({ ...prev, pelapor: res.data.data.user.id }));
        }
      } catch (err) {
        console.error("❌ Gagal mengambil data user:", err);
      }
    };

    // Load data awal
    fetchSiswa();
    if (!initialData) {
      fetchUser();
    }

    // Set form data jika mode edit
    if (initialData) {
      console.log("🔄 Mode Edit - Initial Data:", initialData);
      setFormData({
        id: initialData.id,
        nama_pelanggaran: initialData.nama_pelanggaran,
        deskripsi: initialData.deskripsi,
        status: initialData.status,
        pelapor: initialData.pelapor,
        terlapor: initialData.terlapor,
        nama_foto: null,
      });

      // Debug form data setelah diset
      console.log("📝 Form Data setelah diset:", {
        id: initialData.id,
        nama_pelanggaran: initialData.nama_pelanggaran,
        deskripsi: initialData.deskripsi,
        status: initialData.status,
        pelapor: initialData.pelapor,
        terlapor: initialData.terlapor,
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
          `/pelanggaran/${initialData.id}`,
          form, // Kirim object langsung, bukan FormData
          {
            headers: { "Content-Type": "application/json" },
            nama_pelanggaran: formData.nama_pelanggaran,
            deskripsi: formData.deskripsi,
            status: formData.status,
            pelapor: formData.pelapor,
            terlapor: formData.terlapor,
          }
        );
      }
      // Handle create data
      else {
        console.log("📝 Mengirim request create");
        response = await axiosClient.post("/pelanggaran", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("✅ Response:", response.data);
      onSuccess();
    } catch (err) {
      // Handle error dan tampilkan pesan
      console.error("❌ Error saat submit:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        sentData: formData,
      });

      if (err.response?.status === 422) {
        const errors = err.response.data.message;
        const errorMessages = Object.entries(errors)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
          .join("\n");
        setError(errorMessages);
      } else {
        setError(err.message || "Terjadi kesalahan saat menyimpan data");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Edit" : "Tambah"} Pelanggaran
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Jenis Pelanggaran</label>
            <input
              type="text"
              name="nama_pelanggaran"
              value={formData.nama_pelanggaran}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Deskripsi</label>
            <textarea
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
              <option value="proses">Proses</option>
              <option value="ditolak">Ditolak</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Terlapor</label>
            <select
              name="terlapor"
              value={formData.terlapor}
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
            <label className="block text-sm">Upload Bukti (Opsional)</label>
            <input type="file" name="nama_foto" onChange={handleChange} />
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
  );
};

export default ModalPelanggaran;
