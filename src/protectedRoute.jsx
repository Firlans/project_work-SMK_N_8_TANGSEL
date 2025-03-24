import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "./axiosClient";
import Cookies from "js-cookie";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = Cookies.get("token");
  const userRole = Cookies.get("userRole"); // Simpan role saat login

  if (!token) {
    return <Navigate to="/" replace />; // Redirect ke halaman login jika belum login
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />; // Redirect jika role tidak sesuai
  }

  // Set token ke axios (jaga-jaga jika hilang saat refresh)
  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return <Outlet />;
};

export default ProtectedRoute;
