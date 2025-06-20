//OrangTuaRedirect.jsx

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { decodeToken, saveToken } from "../../utils/jwt";
import Cookies from "js-cookie";

const OrangTuaRedirect = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      saveToken(token);

      // Tambahkan flag agar dianggap sebagai siswa
      Cookies.set("userRole", "orang_tua");
      Cookies.set("token", token);
      Cookies.set("as_siswa", "true");

      navigate("/dashboard-siswa");
    }
  }, [token]);

  return <p className="text-center mt-10">Memproses login orang tua...</p>;
};

export default OrangTuaRedirect;
