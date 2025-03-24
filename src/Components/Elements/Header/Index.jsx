import { useNavigate } from "react-router-dom";
import Button from "../Button";
import axiosClient from "../../../axiosClient";
import Cookies from "js-cookie";

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
    Cookies.remove("userRole"); // Hapus token dari localStorage
    delete axiosClient.defaults.headers.common["Authorization"]; // Hapus token dari axios
    navigate("/login"); // Redirect ke halaman login
  };

  return (
    <div className="w-full bg-white border-b p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">
        SMK Negeri 8 Kota Tangerang Selatan
      </h1>
      <Button
        onClick={handleLogout} // Gunakan handleLogout di sini
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
      >
        Logout
      </Button>
    </div>
  );
};

export default Header;
