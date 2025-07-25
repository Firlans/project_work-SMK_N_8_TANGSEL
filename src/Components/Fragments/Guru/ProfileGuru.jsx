import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import Button from "../../Elements/Button";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { formatTanggal } from "../../../utils/dateFormatter";
import Cookies from "js-cookie"; // Pastikan Cookies di-import

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
  // State baru untuk menyimpan pesan error validasi
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/profile");
        setProfileData(response.data);

        const profile = response.data.data;
        if (profile?.nama) {
          Cookies.set("name", profile.nama, { path: "/" });
        }
        if (profile?.user_id) {
          Cookies.set("user_id", profile.user_id, { path: "/" });
        }
        if (profile?.id) {
          Cookies.set("id_guru", profile.id, { path: "/" });
        }
        // Inisialisasi editedData saat profileData berhasil diambil
        setEditedData({
          alamat: response.data.data.alamat,
          no_telp: response.data.data.no_telp,
        });
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

    setLoading(true); // Set loading true before fetching
    fetchProfile();
  }, []);

  // Fungsi untuk validasi input
  const validateInput = () => {
    let errors = {};
    const numericRegex = /^\d+$/; // Regex untuk hanya angka
    const minLength = 4; // Minimal 4 angka

    // Validasi No. Telepon
    if (!editedData.no_telp) {
      errors.no_telp = "Nomor Telepon tidak boleh kosong.";
    } else if (!numericRegex.test(editedData.no_telp)) {
      errors.no_telp = "Nomor Telepon hanya boleh berisi angka.";
    } else if (editedData.no_telp.length < minLength) {
      errors.no_telp = `Nomor Telepon minimal ${minLength} angka.`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true jika tidak ada error
  };

  // Helper function to mask phone number
  const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    if (phone.length <= 8) return phone;
    const first4 = phone.slice(0, 4);
    const last4 = phone.slice(-4);
    const masked = "*".repeat(phone.length - 8);
    return `${first4}${masked}${last4}`;
  };

  // Fungsi untuk menangani perubahan input pada form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Hapus error spesifik saat user mulai mengetik lagi
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Pastikan editedData diisi dengan nilai saat ini agar user bisa langsung mengedit
    if (profileData) {
      setEditedData({
        alamat: profileData.data.alamat,
        no_telp: profileData.data.no_telp,
      });
    }
    setValidationErrors({}); // Bersihkan error saat memulai edit
  };

  const handleSave = async () => {
    if (!validateInput()) {
      // Jika validasi gagal, tampilkan notifikasi error umum
      setNotification({
        show: true,
        message: "Periksa kembali input Anda. Ada kesalahan.",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return; // Hentikan proses save
    }

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
      // Reset editedData setelah berhasil disimpan
      setEditedData({
        alamat: refreshed.data.data.alamat,
        no_telp: refreshed.data.data.no_telp,
      });
      setValidationErrors({}); // Bersihkan error setelah save berhasil

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
      let errorMessage = "Gagal memperbarui profile. Silakan coba lagi.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setNotification({
        show: true,
        message: errorMessage,
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData)
    return <LoadingSpinner text={"Memuat data..."} />; // Perbaiki text spinner

  // Pastikan profileData ada sebelum merender konten
  if (!profileData && !loading && !error)
    return <div>Data profil tidak ditemukan.</div>;
  if (error) return <div>Terjadi kesalahan saat memuat data profil.</div>;

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
                onClick={() => {
                  setIsEditing(false);
                  // Pastikan editedData kembali ke nilai asli saat cancel
                  if (profileData) {
                    setEditedData({
                      alamat: profileData.data.alamat,
                      no_telp: profileData.data.no_telp,
                    });
                  }
                  setValidationErrors({}); // Bersihkan error saat cancel
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
            {/* Alamat */}
            {isEditing ? (
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  Alamat{" "}
                </label>
                <textarea
                  name="alamat" // Tambahkan atribut name
                  value={editedData.alamat}
                  onChange={handleChange} // Gunakan handleChange
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

            {/* Nomor Telepon */}
            {isEditing ? (
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="no_telp" // Tambahkan atribut name
                  value={editedData.no_telp}
                  onChange={handleChange} // Gunakan handleChange
                  className={`mt-1 block w-full rounded-md border-2 shadow-sm
                    bg-amber-50 dark:bg-gray-800 text-sm sm:text-base text-gray-900 dark:text-white
                    focus:border-blue-500 focus:ring-blue-500 transition ${
                      validationErrors.no_telp
                        ? "border-red-500"
                        : "border-amber-400 dark:border-amber-500"
                    }`}
                  style={{ outline: "none" }}
                />
                {validationErrors.no_telp ? (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.no_telp}
                  </p>
                ) : (
                  <span className="text-xs text-amber-600 mt-1">
                    * Ganti nomor telepon
                  </span>
                )}
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
const ProfileField = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500 dark:text-gray-300">{label}</span>
    <span className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">
      {value}
    </span>
  </div>
);

export default ProfileGuru;
