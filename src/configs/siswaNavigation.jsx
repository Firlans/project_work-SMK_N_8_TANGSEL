import { FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import { FaComments, FaUser, FaUserCheck } from "react-icons/fa6";
import { FiAward } from "react-icons/fi";

export const siswaMenuItems = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "jadwal", label: "Jadwal Belajar", icon: <FaCalendarAlt /> },
  { id: "kehadiran", label: "Presensi Siswa", icon: <FaUserCheck /> },
  { id: "prestasi", label: "Prestasi Siswa", icon: <FiAward /> },
  { id: "pelaporan", label: "Lapor Pelanggaran", icon: <FaExclamationCircle /> },
  { id: "bk", label: "Konsultasi BK", icon: <FaComments /> },
];

export const siswaPageRoutes = {
  profile: "/dashboard-siswa",
  jadwal: "/dashboard-siswa/jadwal-siswa",
  kehadiran: "/dashboard-siswa/kehadiran",
  prestasi: "/dashboard-siswa/prestasi",
  pelaporan: "/dashboard-siswa/pelaporan",
  bk: "/dashboard-siswa/bk",
};
