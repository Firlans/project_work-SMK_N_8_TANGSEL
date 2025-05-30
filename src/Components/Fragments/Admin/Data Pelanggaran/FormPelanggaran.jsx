import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import Cookies from "js-cookie";

const ModalPelanggaran = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    pelapor: "",
    terlapor: "",
    nama_pelanggaran: "",
    deskripsi: "",
    nama_foto: null,
    status: "pengajuan",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [siswaList, setSiswaList] = useState([]);
  const [userPrivilege, setUserPrivilege] = useState(null);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    const privilegeData = Cookies.get("userPrivilege");
    if (privilegeData) {
      try {
        const parsedPrivilege = JSON.parse(privilegeData);
        setUserPrivilege(parsedPrivilege);
        if (!initialData) {
          setFormData((prev) => ({
            ...prev,
            pelapor: parsedPrivilege.id_user,
          }));
        }
      } catch (error) {
        console.error("Error parsing privilege:", error);
      }
    }
  }, [initialData]);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const res = await axiosClient.get("/siswa");
        const sortedSiswa = res.data.data.sort((a, b) =>
          a.nama_lengkap.localeCompare(b.nama_lengkap)
        );
        setSiswaList(sortedSiswa);
      } catch (err) {
        console.error("Gagal mengambil data siswa:", err);
      }
    };

    if (isOpen) {
      fetchSiswa();
      if (initialData) {
        setFormData(initialData);
        if (initialData.nama_foto) {
          setPreviewImage(
            `http://localhost:8000/storage/pelanggaran/${initialData.nama_foto}`
          );
        }
      } else {
        setFormData({
          pelapor: userPrivilege?.id_user || "",
          terlapor: "",
          nama_pelanggaran: "",
          deskripsi: "",
          nama_foto: null,
          status: "pengajuan",
        });
        setPreviewImage(null);
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "nama_foto") {
      setFormData({ ...formData, [name]: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userPrivilege?.id_user) {
    alert("Pelapor tidak ditemukan. Silakan login ulang.");
    return;
  }

  const submitData = new FormData();
  submitData.append("pelapor", isEdit ? formData.pelapor : userPrivilege?.id_user);
  submitData.append("terlapor", formData.terlapor);
  submitData.append("nama_pelanggaran", formData.nama_pelanggaran);
  submitData.append("deskripsi", formData.deskripsi);
  submitData.append("status", formData.status || "pengajuan");

  if (formData.nama_foto) {
    submitData.append("bukti_gambar", formData.nama_foto);
  }

  try {
    if (initialData) {
      await axiosClient.post(`/pelanggaran/${initialData.id}?_method=PUT`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await axiosClient.post("/pelanggaran", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    onSuccess();
  } catch (err) {
    console.error("Gagal simpan pelanggaran:", err);
  }
};


  const getUserRole = () => {
    if (!userPrivilege) return null;
    if (userPrivilege.is_superadmin === 1) return "superadmin";
    if (userPrivilege.is_admin === 1) return "admin";
    if (userPrivilege.is_conselor === 1) return "conselor";
    if (userPrivilege.is_guru === 1) return "guru";
    if (userPrivilege.is_siswa === 1) return "siswa";
    return null;
  };

  const userRole = getUserRole();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Pelanggaran" : "Tambah Pelanggaran"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Terlapor</label>
            <select
              name="terlapor"
              value={formData.terlapor}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map((siswa) => (
                <option key={siswa.id} value={siswa.id}>
                  {siswa.nama_lengkap}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm">Jenis Pelanggaran</label>
            <input
              type="text"
              name="nama_pelanggaran"
              value={formData.nama_pelanggaran}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Bukti Foto</label>
            <input
              type="file"
              name="nama_foto"
              accept="image/*"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          {(userRole === "admin" || userRole === "conselor") && (
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
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
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
