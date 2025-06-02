import { FaExclamationCircle, FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

export const guruMenuItems = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "schedule", label: "Jadwal Mengajar", icon: <FaRegCalendarAlt /> },
  {
    id: "pelaporan",
    label: "Lapor Pelanggaran",
    icon: <FaExclamationCircle />,
  },
];

export const guruPageRoutes = {
  profile: "/dashboard-guru",
  schedule: "/dashboard-guru/jadwal-guru",
  pelaporan: "/dashboard-guru/pelaporan",

  pertemuan: (idJadwal) => `/dashboard-guru/jadwal-guru/${idJadwal}/pertemuan`,
  presensi: (idJadwal, idPertemuan) =>
    `/dashboard-guru/jadwal-guru/${idJadwal}/pertemuan/${idPertemuan}/presensi`,
};
