import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./Pages/landingPage";
import DashboardGuruPage from "./Pages/dashboardGuruPage";
import DashboardSiswaPage from "./Pages/dashboardSiswaPage";
import DashboardAdminPage from "./Pages/admin/dashboardAdminPage";
import ProtectedRoute from "./protectedRoute";
import Unauthorized from "./Pages/unauthorizedPage";
import DashboardKonselorPage from "./Pages/dashboardKonselorPage";
import LoginGuru from "./Pages/loginGuru";
import LoginSiswa from "./Pages/loginSiswa";
import LoginAdmin from "./Pages/admin/loginAdmin";
import LoginKonselor from "./Pages/loginKonselor";
import DataUserPage from "./Pages/admin/dataUserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login-siswa",
    element: <LoginSiswa />,
  },
  {
    path: "/login-guru",
    element: <LoginGuru />,
  },
  {
    path: "/login-admin",
    element: <LoginAdmin />,
  },
  {
    path: "/login-konselor",
    element: <LoginKonselor />,
  },
  // Proteksi Dashboard Guru
  {
    path: "/dashboard-guru",
    element: <ProtectedRoute allowedRoles={["guru"]} />,
    children: [{ path: "/dashboard-guru", element: <DashboardGuruPage /> }],
  },
  // Proteksi Dashboard Siswa
  {
    path: "/dashboard-siswa",
    element: <ProtectedRoute allowedRoles={["siswa"]} />,
    children: [{ path: "/dashboard-siswa", element: <DashboardSiswaPage /> }],
  },
  // Proteksi Dashboard Admin
  {
    path: "/dashboard-admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [{ path: "/dashboard-admin", element: <DashboardAdminPage /> }],
  },
  {
    path: "/dashboard-konselor",
    element: <ProtectedRoute allowedRoles={["konselor"]} />,
    children: [
      { path: "/dashboard-konselor", element: <DashboardKonselorPage /> },
    ],
  },
  { path: "/unauthorized", element: <Unauthorized /> },
  // Jika path tidak ditemukan, redirect ke "/"
  { path: "*", element: <Navigate to="/" replace /> },
  {
    path: "/data-user",
    element: <DataUserPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
