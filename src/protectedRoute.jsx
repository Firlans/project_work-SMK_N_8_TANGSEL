import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "./axiosClient";
import Cookies from "js-cookie";
import { isTokenExpired } from "./utils/jwt";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = Cookies.get("token");
  const role = Cookies.get("userRole"); // Simpan role saat login

  if (!token || isTokenExpired(token)) {
    // Jika token tidak ada atau sudah expired, hapus token dan role dari cookies
    Cookies.remove("token");
    Cookies.remove("userRole");
    return <Navigate to="/unauthorized" replace />; // Redirect ke halaman login jika belum login
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />; // Redirect jika role tidak sesuai
  }

  // Set token ke axios (jaga-jaga jika hilang saat refresh)
  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return <Outlet />;
};

export default ProtectedRoute;
