import { FaExclamationCircle } from "react-icons/fa";
import { FaCommentDots, FaUser } from "react-icons/fa6";

export const konselorMenuItems = [
  { id: "profile", label: "Profile", icon: <FaUser /> },
  { id: "konseling", label: "Chat Konseling", icon: <FaCommentDots /> },
  { id: "pelaporan", label: "Pelaporan", icon: <FaExclamationCircle /> },
];

export const konselorPageRoutes = {
  profile: "/dashboard-konselor",
  konseling: "/dashboard-konselor/konseling",
  pelaporan: "/dashboard-konselor/pelaporan",
};
