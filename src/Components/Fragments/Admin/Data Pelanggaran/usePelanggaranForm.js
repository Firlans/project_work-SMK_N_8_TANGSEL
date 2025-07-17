import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import Cookies from "js-cookie";

export const usePelanggaranForm = (initialData, isOpen) => {
  const [formData, setFormData] = useState({
    pelapor: "",
    terlapor: "", // Ini adalah id siswa yang melakukan pelanggaran
    nama_pelanggaran: "", // Jenis poin negatif
    deskripsi: "",
    nama_foto: null, // Ini akan menampung File object
    status: "pengajuan",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [siswaList, setSiswaList] = useState([]);
  const [userPrivilege, setUserPrivilege] = useState(null);
  const isEdit = Boolean(initialData);
  const [backendError, setBackendError] = useState(""); // Mengganti 'error' untuk error backend umum
  const [validationErrors, setValidationErrors] = useState({}); // State baru untuk client-side validation errors
  const [isSaving, setIsSaving] = useState(false); // State untuk loading saat menyimpan
  const [isFetchingSiswa, setIsFetchingSiswa] = useState(false); // State untuk loading saat fetch siswa

  useEffect(() => {
    const privilegeData = Cookies.get("userPrivilege");
    if (privilegeData) {
      try {
        const parsed = JSON.parse(privilegeData);
        setUserPrivilege(parsed);
      } catch (err) {
        console.error("Failed to parse user privilege from cookie", err);
        setBackendError("Gagal memuat privilege pengguna.");
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return; // Hanya fetch dan inisialisasi saat modal terbuka

    const fetchSiswa = async () => {
      setIsFetchingSiswa(true); // Mulai loading fetch siswa
      try {
        const res = await axiosClient.get("/siswa");
        const sorted = res.data.data.sort((a, b) =>
          a.nama_lengkap.localeCompare(b.nama_lengkap)
        );
        setSiswaList(sorted);
      } catch (err) {
        setBackendError("Gagal memuat data siswa.");
        console.error("Error fetching siswa:", err);
      } finally {
        setIsFetchingSiswa(false); // Selesai loading fetch siswa
      }
    };

    fetchSiswa();

    // Inisialisasi form data dan preview image
    if (initialData) {
      setFormData({ ...initialData, nama_foto: null }); // nama_foto akan diisi File object
      if (initialData.nama_foto) {
        setPreviewImage(
          axiosClient.defaults.baseURL +
            `/images/pelanggaran/${initialData.nama_foto}`
        );
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        // Pastikan pelapor di-set hanya jika userPrivilege sudah ada
        pelapor: userPrivilege?.id_user || "",
        terlapor: "",
        nama_pelanggaran: "",
        deskripsi: "",
        nama_foto: null,
        status: "pengajuan",
      }));
      setPreviewImage(null);
    }
    // Bersihkan error saat modal dibuka/initialData berubah
    setValidationErrors({});
    setBackendError("");
    setIsSaving(false); // Pastikan isSaving false saat modal dibuka
  }, [isOpen, initialData, userPrivilege]); // userPrivilege ditambahkan sebagai dependency

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "nama_foto") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Bersihkan error spesifik saat field diubah
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Fungsi validasi client-side
  const validateForm = () => {
    let errors = {};

    if (!formData.terlapor) {
      errors.terlapor = "Nama Siswa (terlapor) tidak boleh kosong.";
    }
    if (!formData.nama_pelanggaran.trim()) {
      errors.nama_pelanggaran = "Jenis Poin Negatif tidak boleh kosong.";
    }
    if (!formData.deskripsi.trim()) {
      errors.deskripsi = "Deskripsi tidak boleh kosong.";
    }
    // Validasi untuk nama_foto (bukti gambar)
    // Gambar wajib di mode tambah, opsional di mode edit jika sudah ada gambar lama
    if (!isEdit) { // Jika mode tambah
      if (!formData.nama_foto) {
        errors.nama_foto = "Bukti Foto tidak boleh kosong.";
      } else if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(formData.nama_foto.type)) {
        errors.nama_foto = "File harus berupa gambar (JPG, PNG, GIF, WEBP).";
      }
    } else if (formData.nama_foto) { // Jika ada file baru di mode edit
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(formData.nama_foto.type)) {
        errors.nama_foto = "File harus berupa gambar (JPG, PNG, GIF, WEBP).";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // True jika tidak ada error
  };

  const handleSubmit = async (e, customOnSuccess) => { // Tambahkan customOnSuccess
    e.preventDefault();
    setIsSaving(true); // Mulai loading saving
    setBackendError(""); // Bersihkan error backend sebelumnya

    // Validasi client-side
    if (!validateForm()) {
      setIsSaving(false); // Hentikan loading jika validasi gagal
      return;
    }

    // Validasi pelapor (userId) sebelum membuat FormData
    // Ini penting karena pelapor diset dari Cookies yang async
    if (!userPrivilege?.id_user && !isEdit) { // Di mode tambah, pelapor harus ada
        setBackendError("Informasi pelapor tidak tersedia. Coba login ulang.");
        setIsSaving(false);
        return;
    }


    const form = new FormData();
    form.append("pelapor", isEdit ? formData.pelapor : userPrivilege?.id_user);
    form.append("terlapor", formData.terlapor);
    form.append("nama_pelanggaran", formData.nama_pelanggaran.trim());
    form.append("deskripsi", formData.deskripsi.trim());
    form.append("status", formData.status || "pengajuan");

    if (formData.nama_foto) {
      form.append("bukti_gambar", formData.nama_foto);
    } else if (isEdit && initialData.nama_foto) {
        // Jika tidak ada file baru di mode edit tapi ada gambar lama,
        // jangan append 'bukti_gambar'. Backend harus mempertahankan yang lama.
    }


    try {
      if (isEdit) {
        await axiosClient.post(
          `/pelanggaran/${initialData.id}?_method=PUT`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axiosClient.post("/pelanggaran", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (customOnSuccess) customOnSuccess(); // Panggil customOnSuccess
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const backendValidationErrors = err.response.data.errors;
        setValidationErrors((prev) => ({ ...prev, ...backendValidationErrors }));
        setBackendError(err.response.data.message || "Ada kesalahan validasi dari server.");
      } else {
        setBackendError(
          err.response?.data?.message || "Terjadi kesalahan saat menyimpan data."
        );
      }
      console.error("Error saving pelanggaran:", err);
    } finally {
      setIsSaving(false); 
    }
  };

  const getUserRole = () => {
    if (!userPrivilege) return null;
    if (userPrivilege.is_superadmin) return "superadmin";
    if (userPrivilege.is_admin) return "admin";
    if (userPrivilege.is_conselor) return "conselor";
    if (userPrivilege.is_guru) return "guru";
    if (userPrivilege.is_siswa) return "siswa";
    return null;
  };

  return {
    formData,
    setFormData,
    previewImage,
    siswaList,
    handleChange,
    userPrivilege,
    getUserRole,
    isEdit,
    isSaving, 
    isFetchingSiswa, 
    backendError, 
    validationErrors, 
    handleSubmit, 
  };
};