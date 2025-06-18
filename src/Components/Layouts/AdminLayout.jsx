import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Elements/Header/Index";
import Sidebar from "../../Components/Elements/Sidebar/Sidebar";
import { adminMenuItems, adminPageRoutes } from "../../configs/adminNavigation";

const AdminLayout = ({ children, defaultActivePage = "profile" }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(defaultActivePage);

  const handleNavigation = (pageId) => {
    const route = adminPageRoutes[pageId];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <div className="hidden lg:block w-64 flex-shrink-0">
        {" "}
        {/* Sidebar placeholder */}
        <Sidebar
          title="Dashboard Admin"
          menuItems={adminMenuItems}
          setActivePage={handleNavigation}
          activePage={activePage}
        />
      </div>
      <div className="lg:hidden">
        {" "}
        {/* Mobile sidebar */}
        <Sidebar
          title="Dashboard Admin"
          menuItems={adminMenuItems}
          setActivePage={handleNavigation}
          activePage={activePage}
        />
      </div>
      <main className="flex-1 flex flex-col min-w-0">
        {" "}
        {/* Added min-w-0 */}
        <Header />
        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
