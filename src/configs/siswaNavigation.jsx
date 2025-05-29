import { FaCalendarAlt } from "react-icons/fa";
import { FaComments, FaUser, FaUserCheck } from "react-icons/fa6";

export const siswaMenuItems = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "jadwal", label: "Jadwal Belajar", icon: <FaCalendarAlt /> },
  { id: "kehadiran", label: "Presensi Siswa", icon: <FaUserCheck /> },
  { id: "bk", label: "Konsultasi BK", icon: <FaComments /> },
];

export const siswaPageRoutes = {
    profile: "/dashboard-siswa",
    jadwal: "/dashboard-siswa/jadwal-siswa",
    kehadiran: "/dashboard-siswa/kehadiran",
    bk: "dashboard-siswa/bk",
}