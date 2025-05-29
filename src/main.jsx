import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./Pages/landingPage";
import DashboardGuruPage from "./Pages/guru/dashboardGuruPage";
import DashboardSiswaPage from "./Pages/siswa/dashboardSiswaPage";
import DashboardAdminPage from "./Pages/admin/dashboardAdminPage";
import ProtectedRoute from "./protectedRoute";
import Unauthorized from "./Pages/unauthorizedPage";
import DashboardKonselorPage from "./Pages/dashboardKonselorPage";
import LoginGuru from "./Pages/guru/loginGuru";
import LoginSiswa from "./Pages/siswa/loginSiswa";
import LoginAdmin from "./Pages/admin/loginAdmin";
import LoginKonselor from "./Pages/loginKonselor";
import DataUserPage from "./Pages/admin/dataUserPage";
import DataGuruPage from "./Pages/admin/dataGuruPage";
import DataKonselorPage from "./Pages/admin/dataKonselorPage";
import DataSiswaPage from "./Pages/admin/dataSiswaPage";
import DataKelasPage from "./Pages/admin/dataKelasPage";
import DataMapelPage from "./Pages/admin/dataMapelPage";
import DataJadwalPage from "./Pages/admin/dataJadwalPage";
import DataPrestasiPage from "./Pages/admin/dataPrestasiPage";
import DataPelanggaranPage from "./Pages/admin/dataPelanggaranPage";
import DataAdminPage from "./Pages/admin/dataAdminPage";
import JadwalSiswaPage from "./Pages/siswa/jadwalSiswaPage";
import KehadiranSiswaPage from "./Pages/siswa/kehadiranSiswaPage";
import PelaporanSiswaPage from "./Pages/siswa/pelaporanSiswaPage";
import JadwalGuruPage from "./Pages/guru/jadwalGuruPage";
import PresensiSiswaPage from "./Pages/guru/presensiSiswaPage";
import PelaporanGuruPage from "./Pages/guru/pelaporanGuruPage";

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
  {
    path: "/data-admin",
    element: <DataAdminPage />,
  },
  {
    path: "/data-guru",
    element: <DataGuruPage />,
  },
  {
    path: "/data-konselor",
    element: <DataKonselorPage />,
  },
  {
    path: "/data-siswa",
    element: <DataSiswaPage />,
  },
  {
    path: "/data-kelas",
    element: <DataKelasPage />,
  },
  {
    path: "/data-mapel",
    element: <DataMapelPage />,
  },
  {
    path: "/data-jadwal",
    element: <DataJadwalPage />,
  },
  {
    path: "/data-prestasi",
    element: <DataPrestasiPage />,
  },
  {
    path: "/data-pelanggaran",
    element: <DataPelanggaranPage />,
  },
  {
    path: "/dashboard-siswa/jadwal-siswa",
    element: <JadwalSiswaPage />,
  },
  {
    path: "/dashboard-siswa/kehadiran",
    element: <KehadiranSiswaPage />,
  },
  {
    path: "/dashboard-siswa/pelaporan",
    element: <PelaporanSiswaPage />,
  },
  {
    path: "/dashboard-guru/jadwal-guru",
    element: <JadwalGuruPage />,
  },
  {
    path: "/dashboard-guru/kehadiran-siswa",
    element: <PresensiSiswaPage />,
  },
  {
    path: "/dashboard-guru/pelaporan",
    element: <PelaporanGuruPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
