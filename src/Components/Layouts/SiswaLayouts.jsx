import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { siswaMenuItems, siswaPageRoutes } from "../../configs/siswaNavigation";
import Sidebar from "../Elements/Sidebar/Sidebar";
import Header from "../Elements/Header/Index";

const SiswaLayout = ({ children, defaultActivePage = "profile" }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(defaultActivePage);

  const handleNavigation = (pageId) => {
    const route = siswaPageRoutes[pageId];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <Sidebar
        title="Dashboard Siswa"
        menuItems={siswaMenuItems}
        setActivePage={handleNavigation}
        activePage={activePage}
      />
      <div className="flex-1 flex flex-col w-full lg:ml-0">
        <Header />
        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default SiswaLayout;