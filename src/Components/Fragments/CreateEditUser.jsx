import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";

const CreateEditUser = ({ mode, user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "siswa",
    is_active: true,
    profile: {
      jenis_kelamin: "L",
      tanggal_lahir: "",
      alamat: "",
      no_telp: "",
      nip: "",
      nisn: "",
      nis: "",
      id_kelas: "",
      semester: "",
      mata_pelajaran_id: "",
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
          tanggal_lahir: "",
          alamat: "",
          no_telp: "",
          nip: "",
          nisn: "",
          nis: "",
          id_kelas: "",
          semester: "",
          mata_pelajaran_id: "",
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

          <div>
            <label className="block">Tanggal Lahir</label>
            <input
              type="date"
              value={formData.profile.tanggal_lahir}
              onChange={(e) =>
                handleProfileChange("tanggal_lahir", e.target.value)
              }
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block">Alamat</label>
            <textarea
              value={formData.profile.alamat}
              onChange={(e) => handleProfileChange("alamat", e.target.value)}
              className="w-full border rounded p-2"
              rows="3"
            />
          </div>

          <div>
            <label className="block">No. Telepon</label>
            <input
              type="tel"
              value={formData.profile.no_telp}
              onChange={(e) => handleProfileChange("no_telp", e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          {formData.role === "guru" && (
            <div>
              <label className="block">NIP</label>
              <input
                type="text"
                value={formData.profile.nip}
                onChange={(e) => handleProfileChange("nip", e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          )}

          {formData.role === "siswa" && (
            <>
              <div>
                <label className="block">NISN</label>
                <input
                  type="text"
                  value={formData.profile.nisn}
                  onChange={(e) => handleProfileChange("nisn", e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block">NIS</label>
                <input
                  type="text"
                  value={formData.profile.nis}
                  onChange={(e) => handleProfileChange("nis", e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block">Kelas</label>
                <input
                  type="text"
                  value={formData.profile.id_kelas}
                  onChange={(e) =>
                    handleProfileChange("id_kelas", e.target.value)
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block">Semester</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.profile.semester}
                  onChange={(e) =>
                    handleProfileChange("semester", e.target.value)
                  }
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}

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
