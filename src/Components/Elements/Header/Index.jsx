import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import Cookies from "js-cookie";
import Logo from "../../../assets/logo_smkn8tangsel.svg";
import ThemeToggle from "../Theme Toggle/Index";
import axiosClient from "../../../axiosClient";
import { FaCircleChevronDown } from "react-icons/fa6";
import { IoPersonCircleSharp } from "react-icons/io5";

const Header = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosClient.post("/logout");
    } catch (error) {
      console.error("Logout gagal:", error.response?.data);
    }

    Cookies.remove("token");
    Cookies.remove("userRole");
    Cookies.remove("userPrivilege");
    delete axiosClient.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  // close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-0 z-40 mt-2">
      <div className="mx-2 sm:mx-4 md:mx-8">
        <div className="backdrop-blur-md bg-blue-800/90 dark:bg-gray-900/90 border border-blue-900 dark:border-gray-700 shadow-md transition-all rounded-2xl">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-16 relative">
              {/* Sidebar Toggle + Logo */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={onToggleSidebar}
                  className="lg:hidden flex items-center justify-center p-2 
              bg-slate-50 dark:bg-gray-700 
              text-blue-900 dark:text-slate-50
              rounded-lg transition-all"
                  aria-label="Toggle Sidebar"
                >
                  <FaBars className="w-5 h-5" />
                </button>

                <img
                  src={Logo}
                  alt="Logo SMKN 8"
                  className="h-8 sm:h-10 w-auto object-contain"
                />

                <h1
                  className="text-xs sm:text-base lg:text-xl font-bold 
              text-slate-50 dark:text-slate-50
              whitespace-normal leading-tight max-w-[110px] sm:max-w-xs md:max-w-md"
                >
                  SMK NEGERI 8 <br className="block sm:hidden" />
                  KOTA TANGERANG SELATAN
                </h1>
              </div>

              {/* Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1 
              bg-slate-50 dark:bg-gray-700 
              text-blue-900 dark:text-slate-50
              rounded-full hover:bg-slate-200 dark:hover:bg-gray-600 transition-all"
                >
                  <IoPersonCircleSharp className="text-2xl" />
                  <FaCircleChevronDown className="text-lg" />
                </button>

                <div
                  className={`absolute right-0 mt-2 
              bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 
              rounded-lg shadow-lg z-50 transform transition-all duration-200 origin-top
              ${
                dropdownOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
                >
                  <div className="flex gap-2 items-center px-4 py-3">
                    <ThemeToggle />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 
                  text-red-600 dark:text-red-400 
                  hover:text-red-700 dark:hover:text-red-300 
                  transition text-sm font-medium"
                    >
                      <TbLogout2 className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* End Dropdown */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
