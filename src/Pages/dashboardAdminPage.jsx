import React, { useState } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaClipboardCheck,
  FaBookOpen
} from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { GrSchedules } from "react-icons/gr";
import { MdOutlineReport } from "react-icons/md";
import { FiAward } from "react-icons/fi";
import Header from "../Components/Elements/Header/Index";
import ProfileAdmin from "../Components/Fragments/ProfileAdmin";
import DataGuru from "../Components/Fragments/Data Guru/DataGuru";
import DataSiswa from "../Components/Fragments/Data Siswa/DataSiswa";
import JadwalMapel from "../Components/Fragments/JadwalMapel/JadwalMapel";
import DataUser from "../Components/Fragments/Data Users/DataUser";
import DataKehadiranSiswa from "../Components/Fragments/Presensi/DataKehadiranSiswa";
import Sidebar from "../Components/Elements/Sidebar/Sidebar";
import Pelanggaran from "../Components/Fragments/Pelanggaran/Pelanggaran";
import DataKonselor from "../Components/Fragments/Data Konselor/DataKonselor";
// import DataAdmin from "../Components/Fragments/Data Admin/DataAdmin";
// import DataMapel from "../Components/Fragments/Mapel/Data Mapel";
import DataKelas from "../Components/Fragments/Data Kelas/DataKelas";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("profile");

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "users", label: "Data User", icon: <FaUsers /> },
    { id: "admin", label: "Data Admin", icon: <FaUsers /> },
    { id: "teachers", label: "Data Guru", icon: <FaChalkboardTeacher /> },
    { id: "counselor", label: "Data Konselor", icon: <FaChalkboardTeacher /> },
    { id: "students", label: "Data Siswa", icon: <FaUserGraduate /> },
    {
      id: "presence",
      label: "Data Kehadiran Siswa",
      icon: <FaClipboardCheck />,
    },
    { id: "classes", label: "Data Kelas", icon: <SiGoogleclassroom /> },
    { id: "subjects", label: "Mata Pelajaran", icon: <FaBookOpen /> },
    { id: "schedule", label: "Jadwal Pelajaran", icon: <GrSchedules /> },
    { id: "achievement", label: "Prestasi", icon: <FiAward /> },
    { id: "violation", label: "Pelanggaran", icon: <MdOutlineReport /> },
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
          {activePage === "admin" && <DataAdmin />}
          {activePage === "teachers" && <DataGuru />}
          {activePage === "counselor" && <DataKonselor />}
          {activePage === "students" && <DataSiswa />}
          {activePage === "presence" && <DataKehadiranSiswa />}
          {activePage === "classes" && <DataKelas />}
          {activePage === "subjects" && <DataMapel />}
          {activePage === "schedule" && <JadwalMapel />}
          {activePage === "achievement" && <Pelanggaran />}
          {activePage === "violation" && <Pelanggaran />}
        </div>
      </div>
    </div>
  );
}
