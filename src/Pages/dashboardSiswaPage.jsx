import React, { useState, useRef, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUserCheck,
  FaComments,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

const Sidebar = ({ setActivePage, activePage }) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "jadwal", label: "Jadwal Belajar", icon: <FaCalendarAlt /> },
    { id: "kehadiran", label: "Kehadiran Siswa", icon: <FaUserCheck /> },
    { id: "bk", label: "Konsultasi BK", icon: <FaComments /> },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Siswa</h2>
      </div>
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              activePage === item.id
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token dari localStorage
    delete axiosClient.defaults.headers.common["Authorization"]; // Hapus token dari axios
    navigate("/login"); // Redirect ke halaman login
  };

  return (
    <div className="w-full bg-white border-b p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">
        SMK Negeri 8 Kota Tangerang Selatan
      </h1>
      <button
        onClick={handleLogout} // Gunakan handleLogout di sini
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
};

const JadwalBelajar = () => {
  const jadwal = [
    { hari: "Senin", mataPelajaran: "Matematika", waktu: "08:00 - 09:30" },
    { hari: "Selasa", mataPelajaran: "Fisika", waktu: "10:00 - 11:30" },
  ];
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Jadwal Belajar</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hari
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mata Pelajaran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jadwal.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{item.hari}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.mataPelajaran}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.waktu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const KehadiranSiswa = () => {
  const [selectedMapel, setSelectedMapel] = useState("all");

  const mataPelajaran = [
    { id: "mtk", nama: "Matematika" },
    { id: "fsk", nama: "Fisika" },
    { id: "bio", nama: "Biologi" },
    { id: "kim", nama: "Kimia" },
  ];

  const dataKehadiran = [
    {
      pertemuan: 1,
      tanggal: "12 November 2025",
      status: "Hadir",
      mapel: "Matematika",
    },
    {
      pertemuan: 2,
      tanggal: "19 November 2025",
      status: "Tidak Hadir",
      mapel: "Matematika",
    },
    {
      pertemuan: 1,
      tanggal: "13 November 2025",
      status: "Hadir",
      mapel: "Fisika",
    },
    {
      pertemuan: 2,
      tanggal: "20 November 2025",
      status: "Hadir",
      mapel: "Fisika",
    },
    {
      pertemuan: 1,
      tanggal: "14 November 2025",
      status: "Tidak Hadir",
      mapel: "Biologi",
    },
    {
      pertemuan: 1,
      tanggal: "15 November 2025",
      status: "Hadir",
      mapel: "Kimia",
    },
  ];

  const filteredData =
    selectedMapel === "all"
      ? dataKehadiran
      : dataKehadiran.filter(
          (item) =>
            item.mapel ===
            mataPelajaran.find((m) => m.id === selectedMapel)?.nama
        );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kehadiran Siswa</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">
            Mata Pelajaran:
          </label>
          <select
            value={selectedMapel}
            onChange={(e) => setSelectedMapel(e.target.value)}
            className="form-select rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">Semua Mata Pelajaran</option>
            {mataPelajaran.map((mapel) => (
              <option key={mapel.id} value={mapel.id}>
                {mapel.nama}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pertemuan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mata Pelajaran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hari dan Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  Pertemuan {item.pertemuan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.mapel}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.tanggal}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.status === "Hadir"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    alamat: "",
    noTelp: "",
    email: "",
  });

  const profileData = {
    nama: "Ahmad Fauzi",
    nis: "2021001234",
    jenisKelamin: "Laki-laki",
    kelas: "XII RPL 1",
    tempatLahir: "Jakarta",
    tanggalLahir: "15 Agustus 2006",
    alamat: "Jl. Raya Serpong No. 123, Tangerang Selatan",
    noTelp: "081234567890",
    email: "ahmadfauzi@gmail.com",
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      alamat: profileData.alamat,
      noTelp: profileData.noTelp,
      email: profileData.email,
    });
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the data
    console.log("Saving updated data:", editedData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Siswa</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Non-editable fields */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nama Lengkap</span>
            <span className="font-medium">{profileData.nama}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nomor Induk Siswa</span>
            <span className="font-medium">{profileData.nis}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Jenis Kelamin</span>
            <span className="font-medium">{profileData.jenisKelamin}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Kelas</span>
            <span className="font-medium">{profileData.kelas}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Tempat, Tanggal Lahir</span>
            <span className="font-medium">
              {profileData.tempatLahir}, {profileData.tanggalLahir}
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
              <span className="font-medium">{profileData.alamat}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nomor Telepon</span>
            {isEditing ? (
              <input
                type="tel"
                value={editedData.noTelp}
                onChange={(e) =>
                  setEditedData({ ...editedData, noTelp: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <span className="font-medium">{profileData.noTelp}</span>
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
              <span className="font-medium">{profileData.email}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KonselingBK = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "konselor",
      name: "Bpk. Dedi Sukamto",
      message: "Selamat pagi, ada yang bisa saya bantu?",
      timestamp: "09:00",
    },
    {
      id: 2,
      sender: "student",
      name: "Ahmad Fauzi",
      message: "Pagi pak, saya ingin konsultasi mengenai masalah akademik",
      timestamp: "09:05",
    },
    {
      id: 3,
      sender: "konselor",
      name: "Bpk. Dedi Sukamto",
      message: "Baik, silahkan ceritakan masalahnya",
      timestamp: "09:07",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      sender: "student",
      name: "Ahmad Fauzi",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col h-[calc(100vh-130px)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Konseling BK</h2>
        <span className="text-sm text-gray-500">
          Konselor: Bpk. Dedi Sukamto
        </span>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "student" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === "student"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div className="text-sm font-medium mb-1">{msg.name}</div>
              <p>{msg.message}</p>
              <div
                className={`text-xs mt-1 ${
                  msg.sender === "student" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
        >
          <FaPaperPlane />
          Kirim
        </button>
      </form>
    </div>
  );
};

const DashboardSiswaPage = () => {
  const [activePage, setActivePage] = useState("profile");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 flex-1 overflow-auto">
          {activePage === "profile" && <Profile />}
          {activePage === "jadwal" && <JadwalBelajar />}
          {activePage === "kehadiran" && <KehadiranSiswa />}
          {activePage === "bk" && <KonselingBK />}
        </div>
      </div>
    </div>
  );
};

export default DashboardSiswaPage;
