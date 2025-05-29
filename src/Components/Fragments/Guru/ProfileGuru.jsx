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

  // Fetch data profil dari backend saat pertama kali komponen dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/profile"); // Sesuaikan endpoint backend
        console.log("Data Profile:", response.data);
        setProfileData(response.data); // Simpan data dari backend
        setLoading(false);
      } catch (error) {
        if (
          error.response?.data?.status === "Token is Expired" ||
          error.response?.status === 401
        ) {
          return;
        }
        console.error("Gagal mengambil data profil:", error);
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
      console.log("HANDLE SAVE, payload to send:", payload);

      const response = await axiosClient.put(
        `/guru/${profileData.data.id}`,
        payload
      );
      console.log("HANDLE SAVE, response.data:", response.data);

      // Refresh profile setelah update
      const refreshed = await axiosClient.get("/profile");
      console.log("HANDLE SAVE, refreshed.data:", refreshed.data);
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
      console.error("Gagal menyimpan data profil:", error);
      console.log("Gagal menyimpan data profil:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

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

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Profile Guru
          </h2>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
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
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Alamat</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.alamat}
                  onChange={(e) =>
                    setEditedData({ ...editedData, alamat: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                />
              ) : (
                <span className="font-medium text-sm sm:text-base">
                  {profileData?.data?.alamat}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Nomor Telepon</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.no_telp}
                  onChange={(e) =>
                    setEditedData({ ...editedData, no_telp: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                />
              ) : (
                <span className="font-medium text-sm sm:text-base">
                  {maskPhoneNumber(profileData?.data?.no_telp)}
                </span>
              )}
            </div>

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
    <span className="text-sm text-gray-500">{label}</span>
    {isEditing && onChange ? (
      <input
        type={label.toLowerCase().includes("email") ? "email" : "text"}
        value={editValue}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
      />
    ) : (
      <span className="font-medium text-sm sm:text-base">{value}</span>
    )}
  </div>
);

export default ProfileGuru;
