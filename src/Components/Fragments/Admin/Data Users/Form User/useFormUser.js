import { useState, useEffect } from "react";
import axiosClient from "../../../../../axiosClient";

const useFormUser = ({ mode, user, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile: "guru",
    is_active: true,
    data: {
      jenis_kelamin: "L",
      tanggal_lahir: "",
      alamat: "",
      no_telp: "",
      nip: "",
      nisn: "",
      nis: "",
      semester: "",
      id_kelas: "",
    },
  });

  const [privileges, setPrivileges] = useState({
    is_admin: false,
    is_guru: false,
    is_siswa: false,
    is_conselor: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [kelasList, setKelasList] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        profile: user.profile || "guru",
        is_active: user.is_active ?? true,
        data: {
          jenis_kelamin:
            user.guru?.jenis_kelamin || user.siswa?.jenis_kelamin || "L",
          tanggal_lahir:
            user.guru?.tanggal_lahir || user.siswa?.tanggal_lahir || "",
          alamat: user.guru?.alamat || user.siswa?.alamat || "",
          no_telp: user.guru?.no_telp || user.siswa?.no_telp || "",
          nip: user.guru?.nip || "",
          nisn: user.siswa?.nisn || "",
          nis: user.siswa?.nis || "",
          semester: user.siswa?.semester || "",
          id_kelas: user.siswa?.id_kelas || "",
        },
      });

      if (user.privileges) {
        setPrivileges({
          is_admin: user.privileges.is_admin === 1,
          is_guru: user.privileges.is_guru === 1,
          is_siswa: user.privileges.is_siswa === 1,
          is_conselor: user.privileges.is_conselor === 1,
        });
      }
    }
  }, [mode, user]);

  useEffect(() => {
    axiosClient.get("/kelas").then((res) => setKelasList(res.data.data));
  }, []);

  const generatePassword = ({ profile, nis, nip }) => {
    const base = "smkn8#";

    if (profile === "siswa" && nis) return `${base}${nis.slice(-4)}`;
    if (profile === "guru" && nip) return `${base}${nip.slice(-4)}`;
    return `${base}0000`;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Reset privileges if profile is siswa
    if (field === "profile" && value === "siswa") {
      setPrivileges({
        is_admin: false,
        is_guru: false,
        is_siswa: true,
        is_conselor: false,
      });
    }
  };

  const handleDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  const handlePrivilegeChange = (key) => {
    if (formData.profile === "siswa") {
      setPrivileges({
        is_admin: false,
        is_guru: false,
        is_siswa: true,
        is_conselor: false,
      });
    } else {
      setPrivileges((prev) => ({
        ...prev,
        [key]: !prev[key],
        is_siswa: false,
      }));
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama harus diisi";
    if (!formData.email.trim()) newErrors.email = "Email harus diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format email tidak valid";

    if (!formData.data.tanggal_lahir)
      newErrors.tanggal_lahir = "Tanggal lahir harus diisi";
    if (!formData.data.alamat) newErrors.alamat = "Alamat harus diisi";
    if (!formData.data.no_telp) newErrors.no_telp = "Nomor telepon harus diisi";

    if (formData.profile === "siswa") {
      if (!formData.data.nisn) newErrors.nisn = "NISN harus diisi";
      if (!formData.data.nis) newErrors.nis = "NIS harus diisi";
      if (!formData.data.semester) newErrors.semester = "Semester harus diisi";
      if (!formData.data.id_kelas) newErrors.id_kelas = "ID Kelas harus diisi";
    } else if (formData.profile === "guru") {
      if (!formData.data.nip) newErrors.nip = "NIP harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const password =
        mode === "edit"
          ? formData.password
          : generatePassword({
              profile: formData.profile,
              nis: formData.data.nis,
              nip: formData.data.nip,
            });

      const dataToSubmit = {
        ...formData,
        password,
        privileges:
          formData.profile === "guru"
            ? {
                is_superadmin: false,
                is_admin: privileges.is_admin,
                is_guru: true,
                is_siswa: false,
                is_conselor: privileges.is_conselor,
              }
            : {
                is_superadmin: false,
                is_admin: false,
                is_guru: false,
                is_siswa: true,
                is_conselor: false,
              },
      };

      if (mode === "edit" && formData.profile === "siswa") {
        if (user.siswa?.nisn === formData.data.nisn) {
          delete dataToSubmit.data.nisn;
        }
        if (user.siswa?.nis === formData.data.nis) {
          delete dataToSubmit.data.nis;
        }
      }

      let res;
      if (mode === "create") {
        res = await axiosClient.post("/user", dataToSubmit);
      } else {
        res = await axiosClient.put(`/user/${user.id}`, dataToSubmit);
      }

      setNotification({
        show: true,
        message: `User berhasil ${mode === "create" ? "dibuat" : "diupdate"}`,
        type: "success",
      });

      onSuccess();

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        onClose();
      }, 2000);
    } catch (error) {
      setNotification({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    notification,
    kelasList,
    privileges,
    showPassword,
    handleChange,
    handleDataChange,
    handlePrivilegeChange,
    togglePassword,
    handleSubmit,
  };
};

export default useFormUser;
