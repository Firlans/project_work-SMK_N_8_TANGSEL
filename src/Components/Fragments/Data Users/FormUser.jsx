import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

const FormUser = ({ mode, user, onClose, onSuccess }) => {
  // State untuk form data
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

  // State untuk privileges
  const [privileges, setPrivileges] = useState({
    is_admin: false,
    is_guru: false,
    is_siswa: false,
    is_conselor: false,
  });

  // State untuk error
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Effect untuk mengisi form data jika mode edit
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

  // Handle perubahan data profile
  const handleDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }));
  };

  // Handle perubahan privilege
  const handlePrivilegeChange = (privilegeKey) => {
    if (formData.profile === "siswa") {
      // Siswa hanya bisa memiliki is_siswa
      setPrivileges({
        is_admin: false,
        is_guru: false,
        is_siswa: true,
        is_conselor: false,
      });
      return;
    }

    // Untuk guru, bisa multiple privilege kecuali is_siswa
    setPrivileges((prev) => ({
      ...prev,
      [privilegeKey]: !prev[privilegeKey],
      is_siswa: false,
    }));
  };

  // Validasi form
  const validateForm = () => {
    const newErrors = {};

    // Validasi dasar
    if (!formData.name.trim()) {
      newErrors.name = "Nama harus diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (mode === "create" && !formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    // Validasi data umum
    if (!formData.data.tanggal_lahir) {
      newErrors.tanggal_lahir = "Tanggal lahir harus diisi";
    }

    if (!formData.data.alamat) {
      newErrors.alamat = "Alamat harus diisi";
    }

    if (!formData.data.no_telp) {
      newErrors.no_telp = "Nomor telepon harus diisi";
    }

    // Validasi khusus berdasarkan profile
    if (formData.profile === "siswa") {
      if (!formData.data.nisn) {
        newErrors.nisn = "NISN harus diisi";
      }
      if (!formData.data.nis) {
        newErrors.nis = "NIS harus diisi";
      }
      if (!formData.data.semester) {
        newErrors.semester = "Semester harus diisi";
      }
      if (!formData.data.id_kelas) {
        newErrors.id_kelas = "ID Kelas harus diisi";
      }
    } else if (formData.profile === "guru") {
      if (!formData.data.nip) {
        newErrors.nip = "NIP harus diisi";
      }
    }

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  // Handle submit
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }

    try {
      // Pastikan privilege untuk guru disertakan semua yang dicentang
      const guruPrivileges =
        formData.profile === "guru"
          ? {
              is_superadmin: false,
              is_admin: privileges.is_admin,
              is_guru: true, // guru selalu true
              is_siswa: false, // guru tidak bisa jadi siswa
              is_conselor: privileges.is_conselor, // sesuai checkbox
            }
          : {
              is_superadmin: false,
              is_admin: false,
              is_guru: false,
              is_siswa: true,
              is_conselor: false,
            };

      const dataToSubmit = {
        ...formData,
        privileges: guruPrivileges,
      };

      console.log("Data privileges yang akan dikirim:", guruPrivileges);
      console.log("Data lengkap yang akan dikirim:", dataToSubmit);

      let response;
      if (mode === "create") {
        console.log("Membuat user baru...");
        response = await axiosClient.post("/user", dataToSubmit);
      } else {
        console.log("Mengupdate user dengan ID:", user.id);
        response = await axiosClient.put(`/user/${user.id}`, dataToSubmit);
      }

      console.log("Response dari server:", response.data);

      // Tambahkan notifikasi sukses
      setNotification({
        show: true,
        message: `User berhasil ${mode === "create" ? "dibuat" : "diupdate"}`,
        type: "success",
      });

      onSuccess();

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error detail:", error);
      setNotification({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      {/* Notification */}
      {notification.show && (
        <div
          className={`
          fixed top-4 right-4 z-50
          px-6 py-3 rounded-lg shadow-lg
          transform transition-all duration-500 ease-in-out
          ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}
          text-white text-sm font-medium
        `}
        >
          {notification.message}
        </div>
      )}
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">
          {mode === "create" ? "Tambah User Baru" : "Edit User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div>
            <label className="block mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full border rounded p-2 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full border rounded p-2 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block mb-1">
              Password{" "}
              {mode === "edit" && "(Kosongkan jika tidak ingin mengubah)"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full border rounded p-2 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <div>
            <label className="block mb-1">Profile</label>
            <select
              value={formData.profile}
              onChange={(e) => {
                setFormData({ ...formData, profile: e.target.value });
                // Reset privileges saat ganti profile
                if (e.target.value === "siswa") {
                  setPrivileges({
                    is_admin: false,
                    is_guru: false,
                    is_siswa: true,
                    is_conselor: false,
                  });
                }
              }}
              className="w-full border rounded p-2"
            >
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>

          {/* Privileges section */}
          {formData.profile === "guru" && (
            <div className="space-y-2">
              <label className="block font-medium">Privileges</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_admin"
                    checked={privileges.is_admin}
                    onChange={() => handlePrivilegeChange("is_admin")}
                  />
                  <label htmlFor="is_admin">Admin</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_guru"
                    checked={privileges.is_guru}
                    onChange={() => handlePrivilegeChange("is_guru")}
                  />
                  <label htmlFor="is_guru">Guru</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_conselor"
                    checked={privileges.is_conselor}
                    onChange={() => handlePrivilegeChange("is_conselor")}
                  />
                  <label htmlFor="is_conselor">Konselor</label>
                </div>
              </div>
            </div>
          )}

          {/* Fields kondisional berdasarkan profile */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={formData.data.tanggal_lahir}
                onChange={(e) =>
                  handleDataChange("tanggal_lahir", e.target.value)
                }
                className={`w-full border rounded p-2 ${
                  errors.tanggal_lahir ? "border-red-500" : ""
                }`}
              />
              {errors.tanggal_lahir && (
                <span className="text-red-500 text-sm">
                  {errors.tanggal_lahir}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1">Alamat</label>
              <textarea
                value={formData.data.alamat}
                onChange={(e) => handleDataChange("alamat", e.target.value)}
                className={`w-full border rounded p-2 ${
                  errors.alamat ? "border-red-500" : ""
                }`}
              />
              {errors.alamat && (
                <span className="text-red-500 text-sm">{errors.alamat}</span>
              )}
            </div>

            <div>
              <label className="block mb-1">No. Telepon</label>
              <input
                type="tel"
                value={formData.data.no_telp}
                onChange={(e) => handleDataChange("no_telp", e.target.value)}
                className={`w-full border rounded p-2 ${
                  errors.no_telp ? "border-red-500" : ""
                }`}
              />
              {errors.no_telp && (
                <span className="text-red-500 text-sm">{errors.no_telp}</span>
              )}
            </div>
            <div>
              <label className="block mb-1">Jenis Kelamin</label>
              <select
                value={formData.data.jenis_kelamin}
                onChange={(e) =>
                  handleDataChange("jenis_kelamin", e.target.value)
                }
                className="w-full border rounded p-2"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {formData.profile === "guru" ? (
              <div>
                <label className="block mb-1">NIP</label>
                <input
                  type="text"
                  value={formData.data.nip}
                  onChange={(e) => handleDataChange("nip", e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block mb-1">NISN</label>
                  <input
                    type="text"
                    value={formData.data.nisn}
                    onChange={(e) => handleDataChange("nisn", e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">NIS</label>
                  <input
                    type="text"
                    value={formData.data.nis}
                    onChange={(e) => handleDataChange("nis", e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Semester</label>
                  <input
                    type="number"
                    value={formData.data.semester}
                    onChange={(e) =>
                      handleDataChange("semester", e.target.value)
                    }
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">ID Kelas</label>
                  <input
                    type="number"
                    value={formData.data.id_kelas}
                    onChange={(e) =>
                      handleDataChange("id_kelas", e.target.value)
                    }
                    className="w-full border rounded p-2"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {mode === "create" ? "Tambah" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormUser;
