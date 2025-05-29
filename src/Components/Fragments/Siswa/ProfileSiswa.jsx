import axiosClient from "../../../axiosClient.js";
import { useState, useEffect } from "react";
import Button from "../../Elements/Button/index.jsx";
import { formatTanggal } from "../../../utils/dateFormatter.js";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner.jsx";

const ProfileSiswa = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState(null);
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

  const handleEdit = () => {
    if (profileData && profileData.data) {
      console.log("HANDLE EDIT, profileData.data:", profileData.data);
      setEditedData({ ...profileData.data });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Ambil hanya field yang dibutuhkan backend (tanpa id)
      const payload = {
        user_id: editedData.user_id,
        nama_lengkap: editedData.nama_lengkap,
        jenis_kelamin: editedData.jenis_kelamin,
        tanggal_lahir: editedData.tanggal_lahir,
        alamat: editedData.alamat,
        no_telp: editedData.no_telp,
        nisn: editedData.nisn,
        nis: editedData.nis,
        semester: editedData.semester,
        id_kelas: editedData.id_kelas,
      };
      console.log("HANDLE SAVE, payload to send:", payload);

      const response = await axiosClient.put(
        `/siswa/${editedData.id}`,
        payload
      );
      console.log("HANDLE SAVE, response.data:", response.data);

      // Refresh profile setelah update
      const refreshed = await axiosClient.get("/profile");
      console.log("HANDLE SAVE, refreshed.data:", refreshed.data);
      setProfileData(refreshed.data);
      setIsEditing(false);
      setEditedData(null);
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

  const siswa = isEditing ? editedData : profileData?.data;
  console.log("RENDER: siswa yang ditampilkan:", siswa);

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

      {/* Main Content */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Profile Siswa
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
                onClick={() => {
                  setIsEditing(false);
                  setEditedData(null);
                }}
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
          {/* Left Column */}
          <div className="space-y-4">
            <ProfileField label="Nama Lengkap" value={siswa?.nama_lengkap} />
            <ProfileField label="Nomor Induk Siswa" value={siswa?.nis} />
            <ProfileField
              label="Jenis Kelamin"
              value={siswa?.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
            />
            <ProfileField label="Kelas" value={`Kelas ${siswa?.id_kelas}`} />
            <ProfileField
              label="Tanggal Lahir"
              value={formatTanggal(siswa?.tanggal_lahir)}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <ProfileField label="Alamat" value={siswa?.alamat} />
            {isEditing ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nomor Telepon</span>
                <input
                  type="tel"
                  value={editedData.no_telp}
                  onChange={(e) =>
                    setEditedData({ ...editedData, no_telp: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            ) : (
              <ProfileField label="Nomor Telepon" value={siswa?.no_telp} />
            )}
            <ProfileField label="Email" value={siswa?.user?.email} />
            <ProfileField label="Semester" value={siswa?.semester} />
            <ProfileField
              label="Orang Tua"
              value={siswa?.wali_murid?.nama_lengkap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="font-medium text-sm sm:text-base">{value}</span>
  </div>
);

export default ProfileSiswa;
