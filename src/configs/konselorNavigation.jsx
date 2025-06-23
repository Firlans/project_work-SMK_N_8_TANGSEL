import { FaExclamationCircle } from "react-icons/fa";
import { FaCommentDots, FaUser } from "react-icons/fa6";

export const konselorMenuItems = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "konseling", label: "Chat Konseling", icon: <FaCommentDots /> },
  { id: "pelaporan", label: "Pelanggaran", icon: <FaExclamationCircle /> },
];

export const konselorPageRoutes = {
  profile: "/dashboard-konselor",
  konseling: "/dashboard-konselor/konseling",

  "konseling-public": "/dashboard-konselor/konseling/public",
  "konseling-private": "/dashboard-konselor/konseling/private",

  pelaporan: "/dashboard-konselor/pelaporan",
};
