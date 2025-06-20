import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import axiosClient from "./axiosClient";
import { isTokenExpired } from "./utils/jwt";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = Cookies.get("token");
  const role = Cookies.get("userRole");
  const asSiswa = Cookies.get("as_siswa") === "true";

  if (!token || isTokenExpired(token)) {
    Cookies.remove("token");
    Cookies.remove("userRole");
    Cookies.remove("as_siswa");
    return <Navigate to="/unauthorized" replace />;
  }

  // Orang tua boleh masuk jika ke route siswa dan as_siswa true
  if (role === "orang_tua" && asSiswa && allowedRoles.includes("siswa")) {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return <Outlet />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return <Outlet />;
};

export default ProtectedRoute;
