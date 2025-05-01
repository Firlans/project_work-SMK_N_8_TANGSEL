import React, { useState } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import Header from "../Components/Elements/Header/Index";
import ProfileAdmin from "../Components/Fragments/ProfileAdmin";
import DataGuru from "../Components/Fragments/Data Guru/DataGuru";
import DataSiswa from "../Components/Fragments/Data Siswa/DataSiswa";
import JadwalMapel from "../Components/Fragments/JadwalMapel";
import DataUser from "../Components/Fragments/Data Users/DataUser";
import DataKehadiranSiswa from "../Components/Fragments/Presensi/DataKehadiranSiswa";

const Sidebar = ({ setActivePage, activePage }) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "users", label: "Data User", icon: <FaUsers /> },
    { id: "teachers", label: "Data Guru", icon: <FaChalkboardTeacher /> },
    { id: "students", label: "Data Siswa", icon: <FaUserGraduate /> },
    { id: "presence", label: "Data Kehadiran Siswa", icon: <FaCalendarAlt /> },
    { id: "schedule", label: "Jadwal Pelajaran", icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Admin</h2>
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

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("profile");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 flex-1 overflow-auto">
          {activePage === "profile" && <ProfileAdmin />}
          {activePage === "users" && <DataUser />}
          {activePage === "teachers" && <DataGuru />}
          {activePage === "students" && <DataSiswa />}
          {activePage === "presence" && <DataKehadiranSiswa />}
          {activePage === "schedule" && <JadwalMapel />}
        </div>
      </div>
    </div>
  );
}
