import { useNavigate } from "react-router-dom";
import Button from "../Button";
import axiosClient from "../../../axiosClient";
import Cookies from "js-cookie";
import Logo from "../../../assets/logo_smkn8tangsel.svg";
import { TbLogout2 } from "react-icons/tb";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosClient.post("/logout");
      console.log("Logout berhasil:", response.data); // Debugging
    } catch (error) {
      console.error("Logout gagal:", error.response?.data); // Debugging jika gagal
    }

    Cookies.remove("token");
    Cookies.remove("userRole");
    Cookies.remove("userPrivilege");
    delete axiosClient.defaults.headers.common["Authorization"]; // Hapus token dari axios
    navigate("/login"); // Redirect ke halaman login
  };

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and School Name Container - Add left padding on mobile */}
          <div className="flex items-center space-x-3 pl-12 lg:pl-0">
            {" "}
            {/* Added pl-12 here */}
            {/* Logo */}
            <img
              src={Logo}
              alt="Logo SMK Negeri 8"
              className="h-10 w-auto object-contain"
            />
            {/* School Name */}
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 truncate">
              SMK Negeri 8 Kota Tangerang Selatan
            </h1>
          </div>

          {/* Logout Button */}
          <div className="ml-4">
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 px-1 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 whitespace-nowrap"
            >
              <TbLogout2 className="text-lg" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
