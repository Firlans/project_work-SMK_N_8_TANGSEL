import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { konselorMenuItems, konselorPageRoutes } from "../../configs/konselorNavigation";
import Sidebar from "../Elements/Sidebar/Sidebar";
import Header from "../Elements/Header/Index";

const KonselorLayouts = ({ children, defaultActivePage = "profile" }) => {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState(defaultActivePage);

    const handleNavigation = (pageId) => {
        const route = konselorPageRoutes[pageId];
        if (route) {
            navigate(route);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 relative">
            <Sidebar
                title="Dashboard Konselor"
                menuItems={konselorMenuItems}
                setActivePage={handleNavigation}
                activePage={activePage}
            />
            <div className="flex-1 flex flex-col w-full lg:ml-0">
                <Header />
                <div className="p-6 flex-1 overflow-auto">{children}</div>
            </div>
        </div>
    )
}

export default KonselorLayouts