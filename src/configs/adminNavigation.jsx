import {
  FaUser,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaBookOpen,
} from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { GrSchedules } from "react-icons/gr";
import { MdFamilyRestroom, MdOutlineReport } from "react-icons/md";
import { FiAward } from "react-icons/fi";

export const adminMenuItems = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "users", label: "Data User", icon: <FaUsers /> },
  { id: "admin", label: "Data Admin", icon: <FaUsers /> },
  { id: "teachers", label: "Data Guru", icon: <FaChalkboardTeacher /> },
  { id: "counselor", label: "Data Konselor", icon: <FaChalkboardTeacher /> },
  { id: "students", label: "Data Siswa", icon: <FaUserGraduate /> },
  { id: "parents", label: "Data Wali Murid", icon: <MdFamilyRestroom /> },
  { id: "classes", label: "Data Kelas", icon: <SiGoogleclassroom /> },
  { id: "subjects", label: "Mata Pelajaran", icon: <FaBookOpen /> },
  {
    id: "schedule",
    label: "Jadwal Pelajaran dan Presensi",
    icon: <GrSchedules />,
  },
  { id: "achievement", label: "Prestasi", icon: <FiAward /> },
  { id: "violation", label: "Pelanggaran", icon: <MdOutlineReport /> },
];

export const adminPageRoutes = {
  profile: "/dashboard-admin",
  users: "/dashboard-admin/data-user",
  students: "/dashboard-admin/data-siswa",
  parents: "/dashboard-admin/data-wali-murid",
  teachers: "/dashboard-admin/data-guru",
  counselor: "/dashboard-admin/data-konselor",
  admin: "/dashboard-admin/data-admin",
  classes: "/dashboard-admin/data-kelas",
  subjects: "/dashboard-admin/data-mapel",
  schedule: "/dashboard-admin/data-jadwal",
  pertemuan: (idJadwal) => `/dashboard-admin/data-jadwal/${idJadwal}/pertemuan`,
  presensi: (idJadwal, idPertemuan) =>
    `/dashboard-admin/data-jadwal/${idJadwal}/pertemuan/${idPertemuan}/presensi`,

  achievement: "/dashboard-admin/data-prestasi",
  violation: "/dashboard-admin/data-pelanggaran",
};
