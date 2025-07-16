import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import Button from "../../Elements/Button";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { formatTanggal } from "../../../utils/dateFormatter";

const ProfileGuru = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState({
    alamat: "",
    no_telp: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/profile");
        setProfileData(response.data);
        const profile = response.data.data;
        if (profile?.user_id) {
          Cookies.set("user_id", profile.user_id, { path: "/" });
        }
        if (profile?.id) {
          Cookies.set("id_guru", profile.id, { path: "/" });
        }
        setLoading(false);
      } catch (error) {
        if (
          error.response?.data?.status === "Token is Expired" ||
          error.response?.status === 401
        ) {
          return;
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Helper function to mask phone number
  const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    if (phone.length <= 8) return phone;
    const first4 = phone.slice(0, 4);
    const last4 = phone.slice(-4);
    const masked = "*".repeat(phone.length - 8);
    return `${first4}${masked}${last4}`;
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (profileData) {
      setEditedData({
        alamat: profileData.data.alamat,
        no_telp: profileData.data.no_telp,
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Siapkan payload dengan field yang dibutuhkan
      const payload = {
        nip: profileData.data.nip,
        nama: profileData.data.nama,
        jenis_kelamin: profileData.data.jenis_kelamin,
        tanggal_lahir: profileData.data.tanggal_lahir,
        mata_pelajaran_id: profileData.data.mata_pelajaran_id,
        // Data yang diupdate
        alamat: editedData.alamat,
        no_telp: editedData.no_telp,
      };

      await axiosClient.put(`/guru/${profileData.data.id}`, payload);

      // Refresh profile setelah update
      const refreshed = await axiosClient.get("/profile");
      setProfileData(refreshed.data);
      setIsEditing(false);
      setEditedData({
        alamat: "",
        no_telp: "",
      });

      setNotification({
        show: true,
        message: "Profile berhasil diperbarui!",
        type: "success",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      setNotification({
        show: true,
        message: "Gagal memperbarui profile. Silakan coba lagi.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text={"Memperbarui data..."} />;

  return (
    <div className="relative">
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

      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Profile Guru
          </h2>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column - Non-editable fields */}
          <div className="space-y-4">
            <ProfileField
              label="Nama Lengkap"
              value={profileData?.data?.nama}
            />
            <ProfileField label="NIP" value={profileData?.data?.nip} />
            <ProfileField
              label="Jenis Kelamin"
              value={
                profileData?.data?.jenis_kelamin === "L"
                  ? "Laki-laki"
                  : "Perempuan"
              }
            />
            <ProfileField
              label="Tempat, Tanggal Lahir"
              value={formatTanggal(profileData?.data?.tanggal_lahir)}
            />
          </div>

          {/* Right Column - Editable fields */}
          <div className="space-y-4">
            {isEditing ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                  Alamat{" "}
                </span>
                <textarea
                  value={editedData.alamat}
                  onChange={(e) =>
                    setEditedData({ ...editedData, alamat: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-2 border-amber-400 dark:border-amber-500 shadow-sm 
          bg-amber-50 dark:bg-gray-800 text-sm sm:text-base text-gray-900 dark:text-white
          focus:border-blue-500 focus:ring-blue-500 transition resize-none"
                  rows={2}
                  style={{ outline: "none" }}
                />
                <span className="text-xs text-amber-600 mt-1">
                  * Ganti Alamat
                </span>
              </div>
            ) : (
              <ProfileField label="Alamat" value={profileData?.data?.alamat} />
            )}

            {isEditing ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1">
                  Nomor Telepon
                </span>
                <input
                  type="tel"
                  value={editedData.no_telp}
                  onChange={(e) =>
                    setEditedData({ ...editedData, no_telp: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-2 border-amber-400 dark:border-amber-500 shadow-sm 
          bg-amber-50 dark:bg-gray-800 text-sm sm:text-base text-gray-900 dark:text-white
          focus:border-blue-500 focus:ring-blue-500 transition resize-none"
                  style={{ outline: "none" }}
                />
                <span className="text-xs text-amber-600 mt-1">
                  * Ganti nomor telepon
                </span>
              </div>
            ) : (
              <ProfileField
                label="Nomor Telepon"
                value={maskPhoneNumber(profileData?.data?.no_telp)}
              />
            )}

            <ProfileField
              label="Email"
              value={profileData?.data?.user?.email}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for profile fields
const ProfileField = ({ label, value, isEditing, editValue, onChange }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500 dark:text-gray-300">{label}</span>
    {isEditing && onChange ? (
      <input
        type={label.toLowerCase().includes("email") ? "email" : "text"}
        value={editValue}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
      />
    ) : (
      <span className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">
        {value}
      </span>
    )}
  </div>
);

export default ProfileGuru;
