import axiosClient from "../../axiosClient.js";
import { useState, useEffect } from "react";
import Button from "../Elements/Button/index.jsx";
import { formatTanggal } from "../../utils/dateFormatter.js";

const ProfileSiswa = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState(null);

  // Fetch data profil dari backend saat pertama kali komponen dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/profile");
        console.log("FETCH PROFILE:", response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
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
    } catch (error) {
      console.error("Gagal menyimpan data profil:", error);
      console.log("Gagal menyimpan data profil:", error.response?.data);
    }
  };
  
  if (!profileData) {
    console.log("RENDER: profileData is null, show Loading...");
    return <p>Loading...</p>;
  }

  const siswa = isEditing ? editedData : profileData.data;
  console.log("RENDER: siswa yang ditampilkan:", siswa);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Siswa</h2>
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button
              onClick={() => {
                setIsEditing(false);
                setEditedData(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Non-editable fields */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nama Lengkap</span>
            <span className="font-medium">{siswa.nama_lengkap}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nomor Induk Siswa</span>
            <span className="font-medium">{siswa.nis}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Jenis Kelamin</span>
            <span className="font-medium">
              {siswa.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Kelas</span>
            <span className="font-medium">Kelas {siswa.id_kelas}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Tanggal Lahir</span>
            <span className="font-medium">
              {formatTanggal(siswa.tanggal_lahir)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Alamat</span>
            <span className="font-medium">{siswa.alamat}</span>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <span className="font-medium">{siswa.no_telp}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Email</span>
            <span className="font-medium">{siswa.user?.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Semester</span>
            <span className="font-medium">{siswa.semester}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Orang Tua</span>
            <span className="font-medium">
              {siswa.wali_murid?.nama_lengkap}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSiswa;
