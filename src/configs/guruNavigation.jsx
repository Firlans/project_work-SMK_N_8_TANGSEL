import { FaExclamationCircle, FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FiAward } from "react-icons/fi";

export const guruMenuItems = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "schedule", label: "Jadwal Mengajar", icon: <FaRegCalendarAlt /> },
  {
    id: "prestasi",
    label: "Poin Positif",
    icon: <FiAward />,
  },
  {
    id: "pelaporan",
    label: "Poin Negatif",
    icon: <FaExclamationCircle />,
  },
];

export const guruPageRoutes = {
  profile: "/dashboard-guru",
  schedule: "/dashboard-guru/jadwal-guru",
  pelaporan: "/dashboard-guru/poin-negatif",
  prestasi: "/dashboard-guru/poin-positif",

  pertemuan: (idJadwal) => `/dashboard-guru/jadwal-guru/${idJadwal}/pertemuan`,
  presensi: (idJadwal, idPertemuan) =>
    `/dashboard-guru/jadwal-guru/${idJadwal}/pertemuan/${idPertemuan}/presensi`,
};
