import {
  FaUser,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaBookOpen,
} from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { GrSchedules } from "react-icons/gr";
import { MdOutlineReport } from "react-icons/md";
import { FiAward } from "react-icons/fi";

export const adminMenuItems = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "users", label: "Data User", icon: <FaUsers /> },
  { id: "admin", label: "Data Admin", icon: <FaUsers /> },
  { id: "teachers", label: "Data Guru", icon: <FaChalkboardTeacher /> },
  { id: "counselor", label: "Data Konselor", icon: <FaChalkboardTeacher /> },
  { id: "students", label: "Data Siswa", icon: <FaUserGraduate /> },
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
  users: "/data-user",
  students: "/data-siswa",
  teachers: "/data-guru",
  counselor: "/data-konselor",
  admin: "/data-admin",
  classes: "/data-kelas",
  subjects: "/data-mapel",
  schedule: "/data-jadwal",
  achievement: "/data-prestasi",
  violation: "/data-pelanggaran",
};