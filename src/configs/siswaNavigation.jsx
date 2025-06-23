import { FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import { FaComments, FaUser, FaUserCheck } from "react-icons/fa6";
import { FiAward } from "react-icons/fi";

export const siswaMenuItems = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "bk", label: "Chat Konseling", icon: <FaComments /> },
  { id: "jadwal", label: "Jadwal Belajar", icon: <FaCalendarAlt /> },
  { id: "kehadiran", label: "Presensi Siswa", icon: <FaUserCheck /> },
  { id: "prestasi", label: "Prestasi Siswa", icon: <FiAward /> },
  { id: "pelaporan", label: "Pelanggaran", icon: <FaExclamationCircle /> },
];

export const siswaPageRoutes = {
  profile: "/dashboard-siswa",
  jadwal: "/dashboard-siswa/jadwal-siswa",
  kehadiran: "/dashboard-siswa/kehadiran",
  prestasi: "/dashboard-siswa/prestasi",
  pelaporan: "/dashboard-siswa/pelaporan",
  bk: "/dashboard-siswa/konseling",

  "bk-public": "/dashboard-siswa/konseling/public",
  "bk-private": "/dashboard-siswa/konseling/private",
};
