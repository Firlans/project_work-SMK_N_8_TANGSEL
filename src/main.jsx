import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import "./index.css";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import ProtectedRoute from "./protectedRoute";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { ProfileProvider } from "./contexts/ProfileProvider";

// Pages
import LandingPage from "./Pages/landingPage";
import Unauthorized from "./Pages/unauthorizedPage";

// Login Pages
import LoginSiswa from "./Pages/siswa/loginSiswa";
import LoginGuru from "./Pages/guru/loginGuru";
import LoginAdmin from "./Pages/admin/loginAdmin";
import LoginKonselor from "./Pages/konselor/loginKonselor";
import OrangTuaForm from "./Pages/orang_tua/OrangTuaForm";
import OrangTuaRedirect from "./Pages/orang_tua/OrangTuaRedirect";

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
import DataWaliMuridPage from "./Pages/admin/dataWaliMuridPage";

// Siswa Pages
import JadwalSiswaPage from "./Pages/siswa/jadwalSiswaPage";
import KehadiranSiswaPage from "./Pages/siswa/kehadiranSiswaPage";
import PelaporanSiswaPage from "./Pages/siswa/pelaporanSiswaPage";
import PrestasiSiswaPage from "./Pages/siswa/prestasiSiswaPage";
import KonselingSiswaPage from "./Pages/siswa/konselingSiswaPage";
import KonselingSiswaPublicPage from "./Pages/siswa/konselingSIswaPublicPage";
import KonselingSiswaPrivatePage from "./Pages/siswa/konselingSiswaPrivatePage";
import SiswaPublicChatPage from "./Pages/siswa/siswaPublicChatPage";

// Guru Pages
import JadwalGuruPage from "./Pages/guru/jadwalGuruPage";
import PelaporanGuruPage from "./Pages/guru/pelaporanGuruPage";
import PertemuanGuruPage from "./Pages/guru/pertemuanGuruPage";
import PresensiGuruPage from "./Pages/guru/PresensiGuruPage";
import PrestasiGuruPage from "./Pages/guru/prestasiGuruPage";

// Konselor Pages
// import PelaporanKonselorPage from "./Pages/konselor/pelaporanKonselorPage";
import KonselingPage from "./Pages/konselor/konselingPage";
import KoselingPuclicPage from "./Pages/konselor/konselingPublicPage";
import KonselingPrivatePage from "./Pages/konselor/konselingPrivatePage";
import KonselorPublicChatPage from "./Pages/konselor/konselorPublicChatPage";
import SiswaPrivateChatPage from "./Pages/siswa/siswaPrivateChatPage";
import KonselorPrivateChatPage from "./Pages/konselor/konselorPrivateChatPage";

const adminDataRoutes = [
  { path: "/dashboard-admin/data-user", element: <DataUserPage /> },
  { path: "/dashboard-admin/data-admin", element: <DataAdminPage /> },
  { path: "/dashboard-admin/data-guru", element: <DataGuruPage /> },
  { path: "/dashboard-admin/data-konselor", element: <DataKonselorPage /> },
  { path: "/dashboard-admin/data-siswa", element: <DataSiswaPage /> },
  { path: "/dashboard-admin/data-wali-murid", element: <DataWaliMuridPage /> },
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
  { path: "/dashboard-admin/data-poin-positif", element: <DataPrestasiPage /> },
  {
    path: "/dashboard-admin/data-poin-negatif",
    element: <DataPelanggaranPage />,
  },
];

const siswaRoutes = [
  { path: "/dashboard-siswa/jadwal-siswa", element: <JadwalSiswaPage /> },
  { path: "/dashboard-siswa/kehadiran", element: <KehadiranSiswaPage /> },
  { path: "/dashboard-siswa/poin-negatif", element: <PelaporanSiswaPage /> },
  { path: "/dashboard-siswa/poin-positif", element: <PrestasiSiswaPage /> },
  { path: "/dashboard-siswa/konseling", element: <KonselingSiswaPage /> },
  {
    path: "/dashboard-siswa/konseling/public",
    element: <KonselingSiswaPublicPage />,
  },
  {
    path: "/dashboard-siswa/konseling/private",
    element: <KonselingSiswaPrivatePage />,
  },
  {
    path: "/dashboard-siswa/konseling/public/chat-room/:id",
    element: <SiswaPublicChatPage />,
  },
  {
    path: "/dashboard-siswa/konseling/private/chat-room/:id",
    element: <SiswaPrivateChatPage />,
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
  { path: "/dashboard-guru/poin-negatif", element: <PelaporanGuruPage /> },
  { path: "/dashboard-guru/poin-positif", element: <PrestasiGuruPage /> },
];

const konselorRoutes = [
  // { path: "/dashboard-konselor/pelaporan", element: <PelaporanKonselorPage /> },
  { path: "/dashboard-konselor/konseling", element: <KonselingPage /> },
  {
    path: "/dashboard-konselor/konseling/public",
    element: <KoselingPuclicPage />,
  },
  {
    path: "/dashboard-konselor/konseling/private",
    element: <KonselingPrivatePage />,
  },
  {
    path: "/dashboard-konselor/konseling/public/chat-room/:id",
    element: <KonselorPublicChatPage />,
  },
  {
    path: "/dashboard-konselor/konseling/private/chat-room/:id",
    element: <KonselorPrivateChatPage />,
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
  { path: "/login-wali-murid", element: <OrangTuaForm /> },
  { path: "/login/orang-tua", element: <OrangTuaRedirect /> },

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

Modal.setAppElement("#root");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </ThemeProvider>
  </StrictMode>
);
