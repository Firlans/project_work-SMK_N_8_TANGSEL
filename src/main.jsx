import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./Pages/landingPage";
import LoginPage from "./Pages/loginPage";
import DashboardGuru from "./Pages/dashboardGuru";
import Presensi from "./Pages/presensi";
import JadwalGuru from "./Pages/jadwalGuru";

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
    path: "/dashboardGuru",
    element: <DashboardGuru />,
  },
  {
    path: "/presensi",
    element: <Presensi />,
  },
  {
    path: "/jadwal-guru",
    element: <JadwalGuru />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
