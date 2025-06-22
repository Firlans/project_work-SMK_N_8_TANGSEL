import React, { useState, useEffect } from "react";
import axiosClient from "../../../../axiosClient";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";

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
  const [kelasList, setKelasList] = useState([]);

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

  useEffect(() => {
    axiosClient.get("/kelas").then((res) => setKelasList(res.data.data));
  }, []);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }

    try {
      const guruPrivileges =
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
            };

      // Buat salinan data yang akan dikirim
      const dataToSubmit = {
        ...formData,
        privileges: guruPrivileges,
      };

      if (mode === "edit" && formData.profile === "siswa") {
        // Jika NISN tidak berubah, hapus dari data yang dikirim
        if (user.siswa?.nisn === formData.data.nisn) {
          delete dataToSubmit.data.nisn;
        }
        // Jika NIS tidak berubah, hapus dari data yang dikirim
        if (user.siswa?.nis === formData.data.nis) {
          delete dataToSubmit.data.nis;
        }
      }

      console.log("Data yang akan dikirim:", dataToSubmit);

      let response;
      if (mode === "create") {
        response = await axiosClient.post("/user", dataToSubmit);
      } else {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out
        ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}
        text-white text-sm font-medium`}
        >
          {notification.message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative transition-all duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
          {mode === "create" ? "Tambah User Baru" : "Edit User"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 transition-all duration-300"
        >
          {/* Field wrapper */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 transition-colors">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 transition-colors">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 transition-colors">
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
                className={`w-full border rounded p-2 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 transition-colors">
              Profile
            </label>
            <select
              value={formData.profile}
              onChange={(e) => {
                setFormData({ ...formData, profile: e.target.value });
                if (e.target.value === "siswa") {
                  setPrivileges({
                    is_admin: false,
                    is_guru: false,
                    is_siswa: true,
                    is_conselor: false,
                  });
                }
              }}
              className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300"
            >
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>

          {/* Privileges */}
          {formData.profile === "guru" && (
            <div className="space-y-2">
              <label className="block font-medium text-gray-700 dark:text-gray-300 transition-colors">
                Privileges
              </label>
              <div className="space-y-2">
                {["is_admin", "is_guru", "is_conselor"].map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={privileges[key]}
                      onChange={() => handlePrivilegeChange(key)}
                    />
                    <label
                      htmlFor={key}
                      className="text-gray-700 dark:text-gray-300 transition-colors capitalize"
                    >
                      {key.replace("is_", "").replace("_", " ")}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data User */}
          {mode === "create" && (
            <div className="space-y-4">
              {[
                { label: "Tanggal Lahir", type: "date", name: "tanggal_lahir" },
                { label: "Alamat", type: "textarea", name: "alamat" },
                { label: "No. Telepon", type: "tel", name: "no_telp" },
                {
                  label: "Jenis Kelamin",
                  type: "select",
                  name: "jenis_kelamin",
                  options: ["L", "P"],
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 text-gray-700 dark:text-gray-300 transition-colors">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={formData.data[field.name]}
                      onChange={(e) =>
                        handleDataChange(field.name, e.target.value)
                      }
                      className={`w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300 ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={formData.data[field.name]}
                      onChange={(e) =>
                        handleDataChange(field.name, e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "L" ? "Laki-laki" : "Perempuan"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData.data[field.name]}
                      onChange={(e) =>
                        handleDataChange(field.name, e.target.value)
                      }
                      className={`w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300 ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                    />
                  )}
                  {errors[field.name] && (
                    <span className="text-red-500 text-sm">
                      {errors[field.name]}
                    </span>
                  )}
                </div>
              ))}

              {/* Conditional Fields */}
              {formData.profile === "guru" ? (
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-gray-300 transition-colors">
                    NIP
                  </label>
                  <input
                    type="text"
                    value={formData.data.nip}
                    onChange={(e) => handleDataChange("nip", e.target.value)}
                    className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300"
                  />
                </div>
              ) : (
                <>
                  {["nisn", "nis", "semester"].map((field) => (
                    <div key={field}>
                      <label className="block mb-1 text-gray-700 dark:text-gray-300 transition-colors">
                        {field.toUpperCase()}
                      </label>
                      <input
                        type="text"
                        value={formData.data[field]}
                        onChange={(e) =>
                          handleDataChange(field, e.target.value)
                        }
                        className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300"
                      />
                    </div>
                  ))}
                  {/* Select Kelas */}
                  <div>
                    <label className="block mb-1 text-gray-700 dark:text-gray-300 transition-colors">
                      Kelas
                    </label>
                    <select
                      value={formData.data.id_kelas}
                      onChange={(e) =>
                        handleDataChange("id_kelas", e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300"
                    >
                      <option value="">Pilih Kelas</option>
                      {kelasList.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                          {kelas.nama_kelas}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white dark:text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
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
