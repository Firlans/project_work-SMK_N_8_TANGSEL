import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import ProtectedRoute from "./protectedRoute";

// Pages
import LandingPage from "./Pages/landingPage";
import Unauthorized from "./Pages/unauthorizedPage";

// Login Pages
import LoginSiswa from "./Pages/siswa/loginSiswa";
import LoginGuru from "./Pages/guru/loginGuru";
import LoginAdmin from "./Pages/admin/loginAdmin";
import LoginKonselor from "./Pages/konselor/loginKonselor";

// Dashboard Pages
import DashboardSiswaPage from "./Pages/siswa/dashboardSiswaPage";
import DashboardGuruPage from "./Pages/guru/dashboardGuruPage";
import DashboardAdminPage from "./Pages/admin/dashboardAdminPage";
import DashboardKonselorPage from "./Pages/konselor/dashboardKonselorPage";

// Data Management Pages (Admin)
import DataUserPage from "./Pages/admin/dataUserPage";
import DataAdminPage from "./Pages/admin/dataAdminPage";
import DataGuruPage from "./Pages/admin/dataGuruPage";
import DataKonselorPage from "./Pages/admin/dataKonselorPage";
import DataSiswaPage from "./Pages/admin/dataSiswaPage";
import DataKelasPage from "./Pages/admin/dataKelasPage";
import DataMapelPage from "./Pages/admin/dataMapelPage";
import DataJadwalPage from "./Pages/admin/dataJadwalPage";
import DataPertemuanPage from "./Pages/admin/dataPertemuanPage";
import DataPresensiPage from "./Pages/admin/dataPresensiPage";
import DataPrestasiPage from "./Pages/admin/dataPrestasiPage";
import DataPelanggaranPage from "./Pages/admin/dataPelanggaranPage";

// Siswa Pages
import JadwalSiswaPage from "./Pages/siswa/jadwalSiswaPage";
import KehadiranSiswaPage from "./Pages/siswa/kehadiranSiswaPage";
import PelaporanSiswaPage from "./Pages/siswa/pelaporanSiswaPage";
import PrestasiSiswaPage from "./Pages/siswa/prestasiSiswaPage";
import KonselingSiswaPage from "./Pages/siswa/konselingSiswaPage";
import KonselingSiswaPublicPage from "./Pages/siswa/konselingSIswaPublicPage";

// Guru Pages
import JadwalGuruPage from "./Pages/guru/jadwalGuruPage";
import PelaporanGuruPage from "./Pages/guru/pelaporanGuruPage";
import PertemuanGuruPage from "./Pages/guru/pertemuanGuruPage";
import PresensiGuruPage from "./Pages/guru/PresensiGuruPage";

// Konselor Pages
import PelaporanKonselorPage from "./Pages/konselor/pelaporanKonselorPage";
import KonselingPage from "./Pages/konselor/konselingPage";
import KoselingPuclicPage from "./Pages/konselor/konselingPublicPage";
import KonselingPrivatePage from "./Pages/konselor/konselingPrivatePage";

const adminDataRoutes = [
  { path: "/dashboard-admin/data-user", element: <DataUserPage /> },
  { path: "/dashboard-admin/data-admin", element: <DataAdminPage /> },
  { path: "/dashboard-admin/data-guru", element: <DataGuruPage /> },
  { path: "/dashboard-admin/data-konselor", element: <DataKonselorPage /> },
  { path: "/dashboard-admin/data-siswa", element: <DataSiswaPage /> },
  { path: "/dashboard-admin/data-kelas", element: <DataKelasPage /> },
  { path: "/dashboard-admin/data-mapel", element: <DataMapelPage /> },
  { path: "/dashboard-admin/data-jadwal", element: <DataJadwalPage /> },
  {
    path: "/dashboard-admin/data-jadwal/:idJadwal/pertemuan",
    element: <DataPertemuanPage />,
  },
  {
    path: "/dashboard-admin/data-jadwal/:idJadwal/pertemuan/:idPertemuan/presensi",
    element: <DataPresensiPage />,
  },
  { path: "/dashboard-admin/data-prestasi", element: <DataPrestasiPage /> },
  {
    path: "/dashboard-admin/data-pelanggaran",
    element: <DataPelanggaranPage />,
  },
];

const siswaRoutes = [
  { path: "/dashboard-siswa/jadwal-siswa", element: <JadwalSiswaPage /> },
  { path: "/dashboard-siswa/kehadiran", element: <KehadiranSiswaPage /> },
  { path: "/dashboard-siswa/pelaporan", element: <PelaporanSiswaPage /> },
  { path: "/dashboard-siswa/prestasi", element: <PrestasiSiswaPage /> },
  { path: "/dashboard-siswa/konseling", element: <KonselingSiswaPage /> },
  {
    path: "/dashboard-siswa/konseling/public",
    element: <KonselingSiswaPublicPage />,
  },
  {
    path: "/dashboard-siswa/konseling/private",
    element: <KonselingPrivatePage />,
  },
];

const guruRoutes = [
  { path: "/dashboard-guru/jadwal-guru", element: <JadwalGuruPage /> },
  {
    path: "/dashboard-guru/jadwal-guru/:idJadwal/pertemuan",
    element: <PertemuanGuruPage />,
  },
  {
    path: "/dashboard-guru/jadwal-guru/:idJadwal/pertemuan/:idPertemuan/presensi",
    element: <PresensiGuruPage />,
  },
  { path: "/dashboard-guru/pelaporan", element: <PelaporanGuruPage /> },
];

const konselorRoutes = [
  { path: "/dashboard-konselor/pelaporan", element: <PelaporanKonselorPage /> },
  { path: "/dashboard-konselor/konseling", element: <KonselingPage /> },
  {
    path: "/dashboard-konselor/konseling/public",
    element: <KoselingPuclicPage />,
  },
  {
    path: "/dashboard-konselor/konseling/private",
    element: <KonselingPrivatePage />,
  },
];

const router = createBrowserRouter([
  // Public Routes
  { path: "/", element: <LandingPage /> },
  { path: "/login-siswa", element: <LoginSiswa /> },
  { path: "/login-guru", element: <LoginGuru /> },
  { path: "/login-admin", element: <LoginAdmin /> },
  { path: "/login-konselor", element: <LoginKonselor /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  // Protected Dashboards with nested routes
  {
    path: "/dashboard-siswa",
    element: <ProtectedRoute allowedRoles={["siswa"]} />,
    children: [
      { path: "/dashboard-siswa", element: <DashboardSiswaPage /> },
      ...siswaRoutes,
    ],
  },
  {
    path: "/dashboard-guru",
    element: <ProtectedRoute allowedRoles={["guru"]} />,
    children: [
      { path: "/dashboard-guru", element: <DashboardGuruPage /> },
      ...guruRoutes,
    ],
  },
  {
    path: "/dashboard-admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      { path: "/dashboard-admin", element: <DashboardAdminPage /> },
      ...adminDataRoutes,
    ],
  },
  {
    path: "/dashboard-konselor",
    element: <ProtectedRoute allowedRoles={["konselor"]} />,
    children: [
      { path: "/dashboard-konselor", element: <DashboardKonselorPage /> },
      ...konselorRoutes,
    ],
  },

  // Catch all unknown routes
  { path: "*", element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
