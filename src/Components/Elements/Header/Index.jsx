import { useNavigate } from "react-router-dom";
import Button from "../Button";
import axiosClient from "../../../axiosClient";
import Cookies from "js-cookie";
import Logo from "../../../assets/logo_smkn8tangsel.svg";
import { TbLogout2 } from "react-icons/tb";
import { FaBars } from "react-icons/fa";

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosClient.post("/logout");
      console.log("Logout berhasil:", response.data);
    } catch (error) {
      console.error("Logout gagal:", error.response?.data);
    }

    Cookies.remove("token");
    Cookies.remove("userRole");
    Cookies.remove("userPrivilege");
    delete axiosClient.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <header className="w-full sticky top-0 z-40 mt-2">
      <div className="mx-2 sm:mx-4 md:mx-8">
        <div className="backdrop-blur-md bg-indigo-950/80 border-b shadow-md transition-all rounded-2xl">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-16 relative">
              {/* Toggle + Logo & Title */}
              <div className="flex items-center space-x-2 sm:space-x-3 pl-0">
                {/* Toggle Sidebar (mobile only) */}
                <button
                  onClick={onToggleSidebar}
                  className="lg:hidden flex items-center justify-center p-2 bg-white text-indigo-950 rounded-lg mr-2"
                  aria-label="Buka menu"
                  type="button"
                >
                  <FaBars className="w-5 h-5" />
                </button>
                <img
                  src={Logo}
                  alt="Logo SMK Negeri 8"
                  className="h-8 w-auto sm:h-10 object-contain"
                />
                <h1 className="text-sm sm:text-base lg:text-xl font-bold text-white truncate max-w-[120px] sm:max-w-xs md:max-w-md">
                  SMK Negeri 8 Kota Tangerang Selatan
                </h1>
              </div>
              {/* Logout Button */}
              <div className="ml-2 sm:ml-4">
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 whitespace-nowrap"
                >
                  <TbLogout2 className="text-lg" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
