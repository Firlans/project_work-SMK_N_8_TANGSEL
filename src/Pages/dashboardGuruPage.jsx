import { useState } from "react";
import { FaUser, FaUserCheck, FaCalendarAlt } from "react-icons/fa";
import Header from "../Components/Elements/Header/Index";
import ProfileGuru from "../Components/Fragments/ProfileGuru";
import Sidebar from "../Components/Elements/Sidebar/Sidebar";
import JadwalGuru from "../Components/Fragments/Guru/JadwalGuru";
import KehadiranSiswaByGuru from "../Components/Fragments/Guru/KehadiranSiswaByGuru";

const DashboardGuruPage = () => {
  const [activePage, setActivePage] = useState("profile");

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "schedule", label: "Jadwal Mengajar", icon: <FaCalendarAlt /> },
    { id: "attendance", label: "Presensi Siswa", icon: <FaUserCheck /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        title="Dashboard Guru"
        menuItems={menuItems}
        setActivePage={setActivePage}
        activePage={activePage}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-8">
          {activePage === "profile" && <ProfileGuru />}
          {activePage === "schedule" && <JadwalGuru />}
          {activePage === "attendance" && <KehadiranSiswaByGuru />}
        </div>
      </div>
    </div>
  );
};

export default DashboardGuruPage;
