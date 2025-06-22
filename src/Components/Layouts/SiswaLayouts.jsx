import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { siswaMenuItems, siswaPageRoutes } from "../../configs/siswaNavigation";
import Sidebar from "../Elements/Sidebar/Sidebar";
import Header from "../Elements/Header/Index";
import useReadOnlyRole from "../../hooks/useReadOnlyRole";
import { useProfile } from "../../contexts/ProfileProvider";

const SiswaLayout = ({ children, defaultActivePage = "profile" }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(defaultActivePage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isReadOnly = useReadOnlyRole();
  const { profile } = useProfile();

  const filteredMenu = isReadOnly
    ? siswaMenuItems.filter((item) => item.id !== "bk")
    : siswaMenuItems;

  const handleNavigation = (pageId) => {
    const route = siswaPageRoutes[pageId];

    if (route) {
      setActivePage(pageId);
      navigate(route);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-500 relative">
      <Sidebar
        title="Dashboard Siswa"
        menuItems={filteredMenu}
        setActivePage={handleNavigation}
        activePage={activePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        profile={profile}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-3 transition-all duration-1000">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <div className="p-3 sm:p-4 md:p-6 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default SiswaLayout;
