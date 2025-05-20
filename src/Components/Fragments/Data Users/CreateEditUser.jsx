import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";

const CreateEditUser = ({ mode, user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    is_active: true,
    profile: {
      jenis_kelamin: "L",
    },
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && user) {
      console.log("Original user data:", user);

      // Ensure profile exists with default values
      const userWithDefaultProfile = {
        ...user,
        password: "",
        profile: {
          jenis_kelamin: "L",
          ...user.profile, // Merge existing profile data if any
        },
      };

      console.log("Processed user data:", userWithDefaultProfile);
      setFormData(userWithDefaultProfile);
    }
  }, [mode, user]);
  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Nama Lengkap harus diisi";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validate password for new users
    if (mode === "create" && !formData.password) {
      newErrors.password = "Password harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      setNotification({
        show: true,
        message: "Mohon lengkapi semua field yang dibutuhkan",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return;
    }
    console.log("Submitting form data:", formData);
    try {
      let response;
      if (mode === "edit") {
        console.log("Updating user:", user.id);
        response = await axiosClient.put(`/user/${user.id}`, formData);
      } else {
        console.log("Creating new user");
        response = await axiosClient.post("/user", formData);
      }
      console.log("API Response:", response.data);

      // Show success notification
      setNotification({
        show: true,
        message:
          mode === "edit"
            ? "User berhasil diperbarui!"
            : "User berhasil ditambahkan!",
        type: "success",
      });

      // Hide notification and close modal after delay
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      console.error(
        "Error saving user:",
        error.response?.data || error.message
      );

      // Show error notification
      setNotification({
        show: true,
        message: `Gagal ${
          mode === "edit" ? "memperbarui" : "menambahkan"
        } user. ${error.response?.data?.message || "Silakan coba lagi."}`,
        type: "error",
      });

      // Hide error notification after delay
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Notification */}
        {notification.show && (
          <div
            className={`
              absolute top-4 right-4 z-50 
              px-4 py-2 rounded-lg shadow-lg
              transform transition-all duration-500 ease-in-out
              ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}
              text-white text-sm font-medium
            `}
          >
            {notification.message}
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">
          {mode === "create" ? "Create New User" : "Edit User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: "" });
                }
              }}
              className={`w-full border rounded p-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-1">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="block">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) {
                  setErrors({ ...errors, email: "" });
                }
              }}
              className={`w-full border rounded p-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="block">
              Password{" "}
              {mode === "edit" && "(kosongkan jika tidak ingin mengubah)"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) {
                  setErrors({ ...errors, password: "" });
                }
              }}
              className={`w-full border rounded p-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password}
              </span>
            )}
          </div>

          <div>
            <label className="block">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border rounded p-2"
              required
            >
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="konselor">Konselor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block">Jenis Kelamin</label>
            <select
              value={formData.profile.jenis_kelamin}
              onChange={(e) =>
                handleProfileChange("jenis_kelamin", e.target.value)
              }
              className="w-full border rounded p-2"
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {mode === "create" ? "Create" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditUser;
