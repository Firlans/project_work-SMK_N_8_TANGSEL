import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import Cookies from "js-cookie";

const defaultFormData = {
  id: "",
  nama_prestasi: "",
  deskripsi: "",
  status: "pengajuan", // Default status is 'pengajuan'
  nama_foto: null, // This will hold the File object
  siswa_id: "",
};

export const usePrestasiForm = (isOpen, initialData, onSuccess) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [siswaOptions, setSiswaOptions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [backendError, setBackendError] = useState(""); // Mengganti 'error' menjadi 'backendError' untuk kejelasan
  const [validationErrors, setValidationErrors] = useState({}); // State baru untuk client-side validation errors
  const [loading, setLoading] = useState(false);
  const [userPrivilege, setUserPrivilege] = useState(null);

  useEffect(() => {
    const privilegeData = Cookies.get("userPrivilege");
    if (privilegeData) {
      try {
        const parsed = JSON.parse(privilegeData);
        setUserPrivilege(parsed);
      } catch (err) {
        // Jika parsing gagal, set error atau log
        console.error("Failed to parse user privilege from cookie", err);
        setBackendError("Gagal memuat privilege pengguna."); // Set error jika ada masalah parsing
      }
    }
  }, []);

  // Fetch data siswa dan inisialisasi form
  useEffect(() => {
    if (!isOpen) return; // Hanya fetch saat modal terbuka

    const fetchSiswa = async () => {
      try {
        const res = await axiosClient.get("/siswa");
        const sorted = res.data.data.sort((a, b) =>
          a.nama_lengkap.localeCompare(b.nama_lengkap)
        );
        setSiswaOptions(sorted);
      } catch (err) {
        setBackendError("Gagal memuat data siswa."); // Set error jika fetch gagal
        console.error("Error fetching siswa:", err);
      }
    };

    fetchSiswa();

    // Inisialisasi formData dan previewImage
    if (initialData) {
      setFormData({ ...initialData, nama_foto: null }); // nama_foto akan diisi File object
      if (initialData.nama_foto) {
        setPreviewImage(
          axiosClient.defaults.baseURL +
            `/images/prestasi/${initialData.nama_foto}`
        );
      }
    } else {
      setFormData(defaultFormData);
      setPreviewImage(null);
    }
    setValidationErrors({}); 
    setBackendError(""); 
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "nama_foto") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, nama_foto: file }));
      setPreviewImage(file ? URL.createObjectURL(file) : null);
      if (validationErrors.nama_foto) {
        setValidationErrors((prev) => ({ ...prev, nama_foto: undefined }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (validationErrors[name]) {
        setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  // Fungsi validasi client-side yang diperbarui
  const validateForm = () => {
    let errors = {};

    if (!formData.siswa_id) {
      errors.siswa_id = "Nama Siswa tidak boleh kosong.";
    }
    if (!formData.nama_prestasi.trim()) {
      errors.nama_prestasi = "Nama Prestasi tidak boleh kosong.";
    }
    if (!formData.deskripsi.trim()) {
      errors.deskripsi = "Deskripsi tidak boleh kosong.";
    }
    if (!initialData) {
      // Hanya wajib di mode tambah
      if (!formData.nama_foto) {
        errors.nama_foto = "Bukti Gambar tidak boleh kosong.";
      } else if (
        !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          formData.nama_foto.type
        )
      ) {
        errors.nama_foto = "File harus berupa gambar (JPG, PNG, GIF, WEBP).";
      }
    } else if (formData.nama_foto) {
      // Jika ada file baru di mode edit
      if (
        !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          formData.nama_foto.type
        )
      ) {
        errors.nama_foto = "File harus berupa gambar (JPG, PNG, GIF, WEBP).";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Mengembalikan true jika tidak ada error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBackendError(""); // Clear previous backend errors

    // Panggil validasi client-side
    if (!validateForm()) {
      setLoading(false); // Hentikan loading jika validasi gagal
      return;
    }

    const form = new FormData();
    form.append("siswa_id", formData.siswa_id);
    form.append("nama_prestasi", formData.nama_prestasi.trim());
    form.append("deskripsi", formData.deskripsi.trim());
    form.append("status", formData.status || "pengajuan");
    if (formData.nama_foto) {
      form.append("bukti_gambar", formData.nama_foto);
    } else if (initialData && initialData.nama_foto) {
    }

    try {
      if (initialData) {
        await axiosClient.post(
          `/prestasi/${initialData.id}?_method=PUT`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axiosClient.post("/prestasi", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSuccess(); // Panggil onSuccess setelah berhasil
    } catch (err) {
      // Tangani error dari backend, terutama error validasi 422
      if (err.response && err.response.status === 422) {
        // Asumsi backend mengirimkan error dalam format { errors: { field: ["message"] } }
        const backendValidationErrors = err.response.data.errors;
        // Gabungkan error backend dengan error frontend jika ada
        setValidationErrors((prev) => ({
          ...prev,
          ...backendValidationErrors,
        }));
        setBackendError(
          err.response.data.message || "Ada kesalahan validasi dari server."
        );
      } else {
        setBackendError(
          err.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan data."
        );
      }
      console.error("Error saving prestasi:", err);
    } finally {
      setLoading(false);
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
    siswaOptions,
    previewImage,
    backendError, // Mengembalikan backendError
    validationErrors, // Mengembalikan validationErrors
    loading,
    handleChange,
    handleSubmit,
    getUserRole,
  };
};
