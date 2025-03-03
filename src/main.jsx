import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./Pages/landingPage";
import LoginPage from "./Pages/loginPage";
import DashboardGuruPage from "./Pages/dashboardGuruPage";
import DashboardSiswaPage from "./Pages/dashboardSiswaPage";
import JadwalGuruPage from "./Pages/jadwalGuruPage";
import MonitoringPresensiPage from "./Pages/monitoringPresensiPage";
import DashboardAdminPage from "./Pages/dashboardAdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard-guru",
    element: <DashboardGuruPage />,
  },
  {
    path: "/monitoring-presensi",
    element: <MonitoringPresensiPage />,
  },
  {
    path: "/jadwal-guru",
    element: <JadwalGuruPage />,
  },
  {
    path: "/dashboard-siswa",
    element: <DashboardSiswaPage />,
  },
  {
    path: "/dashboard-admin",
    element: <DashboardAdminPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
