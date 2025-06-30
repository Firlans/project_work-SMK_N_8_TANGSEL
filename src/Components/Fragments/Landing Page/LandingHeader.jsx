import { useState, useEffect, useRef } from "react";
import LoginDropdown from "./LoginDropDown";

const LandingHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

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
        <div className="backdrop-blur-md bg-slate-300/75 shadow-md transition-colors duration-300 rounded-2xl">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-16 relative transition-all duration-300">
              {/* Logo dan Nama */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img
                  src="/images/logo-smkn8tangsel.png"
                  alt="Logo SMKN 8"
                  className="h-8 sm:h-10 w-auto object-contain transition-all duration-300"
                />
                <h1 className="text-xs sm:text-base lg:text-xl font-bold text-slate-900 whitespace-normal leading-tight max-w-[110px] sm:max-w-xs md:max-w-md transition-all duration-300">
                  SMK NEGERI 8 <br className="block sm:hidden" />
                  KOTA TANGERANG SELATAN
                </h1>
              </div>

              {/* Toggle & Dropdown Login */}
              <div className="flex items-center space-x-4">
                <LoginDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
