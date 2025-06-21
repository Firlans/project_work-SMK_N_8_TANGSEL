import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";

const defaultFormData = {
  id: "",
  nama_prestasi: "",
  deskripsi: "",
  status: "pengajuan",
  nama_foto: null,
  siswa_id: "",
};

export const usePrestasiForm = (isOpen, initialData, onSuccess) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [siswaOptions, setSiswaOptions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch data siswa
  useEffect(() => {
    if (!isOpen) return;

    const fetchSiswa = async () => {
      try {
        const res = await axiosClient.get("/siswa");
        const sorted = res.data.data.sort((a, b) =>
          a.nama_lengkap.localeCompare(b.nama_lengkap)
        );
        setSiswaOptions(sorted);
      } catch (err) {
        console.error("Gagal mengambil siswa:", err);
      }
    };

    fetchSiswa();

    if (initialData) {
      setFormData({ ...initialData, nama_foto: null })
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
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "nama_foto") {
      setFormData((prev) => ({ ...prev, nama_foto: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData();
    form.append("siswa_id", formData.siswa_id);
    form.append("nama_prestasi", formData.nama_prestasi);
    form.append("deskripsi", formData.deskripsi);
    form.append("status", formData.status);
    if (formData.nama_foto) {
      form.append("bukti_gambar", formData.nama_foto);
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
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    siswaOptions,
    previewImage,
    error,
    loading,
    handleChange,
    handleSubmit,
  };
};
