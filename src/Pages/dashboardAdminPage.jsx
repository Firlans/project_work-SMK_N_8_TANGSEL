import React, { useState } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCalendarAlt,
  FaUsers,
  FaClipboardCheck,
} from "react-icons/fa";
import Header from "../Components/Elements/Header/Index";
import ProfileAdmin from "../Components/Fragments/ProfileAdmin";
import DataGuru from "../Components/Fragments/Data Guru/DataGuru";
import DataSiswa from "../Components/Fragments/Data Siswa/DataSiswa";
import JadwalMapel from "../Components/Fragments/JadwalMapel/JadwalMapel";
import DataUser from "../Components/Fragments/Data Users/DataUser";
import DataKehadiranSiswa from "../Components/Fragments/Presensi/DataKehadiranSiswa";
import Sidebar from "../Components/Elements/Sidebar/Sidebar";
import Pelanggaran from "../Components/Fragments/Pelanggaran/Pelanggaran";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("profile");

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "users", label: "Data User", icon: <FaUsers /> },
    { id: "teachers", label: "Data Guru", icon: <FaChalkboardTeacher /> },
    { id: "students", label: "Data Siswa", icon: <FaUserGraduate /> },
    {
      id: "presence",
      label: "Data Kehadiran Siswa",
      icon: <FaClipboardCheck />,
    },
    { id: "schedule", label: "Jadwal Pelajaran", icon: <FaCalendarAlt /> },
    { id: "violation", label: "Pelanggaran", icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <Sidebar
        title="Dashboard Siswa"
        menuItems={menuItems}
        setActivePage={setActivePage}
        activePage={activePage}
      />
      <div className="flex-1 flex flex-col w-full lg:ml-0">
        <Header />
        <div className="p-6 flex-1 overflow-auto">
          {activePage === "profile" && <ProfileAdmin />}
          {activePage === "users" && <DataUser />}
          {activePage === "teachers" && <DataGuru />}
          {activePage === "students" && <DataSiswa />}
          {activePage === "presence" && <DataKehadiranSiswa />}
          {activePage === "schedule" && <JadwalMapel />}
          {activePage === "violation" && <Pelanggaran />}
        </div>
      </div>
    </div>
  );
}
