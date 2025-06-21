import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import Cookies from "js-cookie";

export const usePelanggaranForm = (initialData, isOpen) => {
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
        const parsed = JSON.parse(privilegeData);
        setUserPrivilege(parsed);
        if (!initialData) {
          setFormData((prev) => ({
            ...prev,
            pelapor: parsed.id_user,
          }));
        }
      } catch (err) {
        console.error("Error parsing privilege:", err);
      }
    }
  }, [initialData]);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const res = await axiosClient.get("/siswa");
        const sorted = res.data.data.sort((a, b) =>
          a.nama_lengkap.localeCompare(b.nama_lengkap)
        );
        setSiswaList(sorted);
      } catch (err) {
        console.error("Gagal fetch siswa:", err);
      }
    };

    if (isOpen) {
      fetchSiswa();
      if (initialData) {
        setFormData(initialData);
        if (initialData.nama_foto) {
          setPreviewImage(
            axiosClient.defaults.baseURL +
              `/images/pelanggaran/${initialData.nama_foto}`
          );
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          pelapor: userPrivilege?.id_user || "",
          terlapor: "",
          nama_pelanggaran: "",
          deskripsi: "",
          nama_foto: null,
          status: "pengajuan",
        }));
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
  };
};
