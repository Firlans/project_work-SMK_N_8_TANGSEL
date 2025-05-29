import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser, FaUserCheck } from "react-icons/fa6";


export const guruMenuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "schedule", label: "Jadwal Mengajar", icon: <FaRegCalendarAlt /> },
    { id: "attendance", label: "Presensi Siswa", icon: <FaUserCheck /> },
    { id: "pelaporan", label: "Lapor Pelanggaran", icon: <FaUserCheck /> },
  ];

export const guruPageRoutes = {
    profile: "/dashboard-guru",
    schedule: "/dashboard-guru/jadwal-guru",
    attendance: "/dashboard-guru/kehadiran-siswa",
    pelaporan: "/dashboard-guru/pelaporan",
  };