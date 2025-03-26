import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import Button from "../Elements/Button";

const ProfileGuru = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState({
    alamat: "",
    no_telp: "",
    email: "",
  });

  // Fetch data profil dari backend saat pertama kali komponen dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/profile"); // Sesuaikan endpoint backend
        console.log("Data Profile:", response.data);
        setProfileData(response.data); // Simpan data dari backend
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    if (profileData) {
      setEditedData({
        alamat: profileData.data.alamat,
        no_telp: profileData.data.no_telp,
        email: profileData.email,
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await axiosClient.put("/profile", editedData); // Endpoint update profil
      setProfileData(response.data); // Update state dengan data terbaru dari backend
      setIsEditing(false);
    } catch (error) {
      console.error("Gagal menyimpan data profil:", error);
    }
  };

  if (!profileData) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Guru</h2>
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
              onClick={() => setIsEditing(false)}
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
            <span className="font-medium">{profileData.data.nama}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">NIP</span>
            <span className="font-medium">{profileData.data.nip}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Jenis Kelamin</span>
            <span className="font-medium">
              {profileData.data.jenis_kelamin === "L"
                ? "Laki-laki"
                : "Perempuan"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Tempat, Tanggal Lahir</span>
            <span className="font-medium">
              {profileData.data.tanggal_lahir}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {/* Editable fields */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Alamat</span>
            {isEditing ? (
              <input
                type="text"
                value={editedData.alamat}
                onChange={(e) =>
                  setEditedData({ ...editedData, alamat: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <span className="font-medium">{profileData.data.alamat}</span>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <span className="font-medium">{profileData.data.no_telp}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Email</span>
            {isEditing ? (
              <input
                type="email"
                value={editedData.email}
                onChange={(e) =>
                  setEditedData({ ...editedData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <span className="font-medium">{profileData.data.user.email}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGuru;
