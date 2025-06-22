import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Elements/Header/Index";
import Sidebar from "../../Components/Elements/Sidebar/Sidebar";
import { adminMenuItems, adminPageRoutes } from "../../configs/adminNavigation";
import { useProfile } from "../../contexts/ProfileProvider";

const AdminLayout = ({ children, defaultActivePage = "profile" }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(defaultActivePage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useProfile();

  const handleNavigation = (pageId) => {
    const route = adminPageRoutes[pageId];
    if (route) {
      setActivePage(pageId);
      navigate(route);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-500 relative">
      <Sidebar
        title="Dashboard Admin"
        menuItems={adminMenuItems}
        setActivePage={handleNavigation}
        activePage={activePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        profile={profile}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-0 transition-all duration-300">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <div className="p-3 sm:p-4 md:p-6 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
