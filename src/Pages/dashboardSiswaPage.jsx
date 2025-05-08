import React, { useState, useRef, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUserCheck,
  FaComments,
  FaUser,
  FaPaperPlane,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Header from "../Components/Elements/Header/Index";
import ProfileSiswa from "../Components/Fragments/ProfileSiswa";
import KehadiranSiswa from "../Components/Fragments/Siswa/KehadiranSiswa";
import JadwalSiswa from "../Components/Fragments/Siswa/JadwalSiswa";
import Sidebar from "../Components/Elements/Sidebar/Sidebar";


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

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "jadwal", label: "Jadwal Belajar", icon: <FaCalendarAlt /> },
    { id: "kehadiran", label: "Kehadiran Siswa", icon: <FaUserCheck /> },
    { id: "bk", label: "Konsultasi BK", icon: <FaComments /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
     <Sidebar
        title="Dashboard Guru"
        menuItems={menuItems}
        setActivePage={setActivePage}
        activePage={activePage}
      />
      <div className="flex-1 flex flex-col w-full lg:ml-0">
        <Header />
        <div className="p-6 flex-1 overflow-auto">
          {activePage === "profile" && <ProfileSiswa />}
          {activePage === "jadwal" && <JadwalSiswa />}
          {activePage === "kehadiran" && <KehadiranSiswa />}
          {activePage === "bk" && <KonselingBK />}
        </div>
      </div>
    </div>
  );
};

export default DashboardSiswaPage;
