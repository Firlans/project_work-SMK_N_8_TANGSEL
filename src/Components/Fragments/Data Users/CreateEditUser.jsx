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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      onSuccess();
      onClose();
    } catch (error) {
      console.error(
        "Error saving user:",
        error.response?.data || error.message
      );
    }
  };

  const handleProfileChange = (field, value) => {
    console.log(`Updating profile field: ${field}`, value);
    console.log("Current formData:", formData);

    // Ensure profile exists
    const currentProfile = formData.profile || {};

    setFormData({
      ...formData,
      profile: {
        ...currentProfile,
        [field]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {mode === "create" ? "Create New User" : "Edit User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block">
              Password {mode === "edit" && "(leave blank to keep current)"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border rounded p-2"
              required={mode === "create"}
            />
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
