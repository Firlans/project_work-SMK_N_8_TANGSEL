import { Link } from "react-router-dom";

const FooterLogin = () => {
  return (
    <div className="absolute bottom-6 flex justify-between w-full px-10 text-gray-600 text-sm">
      <Link
        to="/login-orangtua"
        className="block font-medium text-slate-500 mt-2 hover:text-blue-600 transition"
      >
        Masuk / Login Orang Tua / Wali
      </Link>
      <Link
        to="/dashboard-guru"
        className="block font-medium text-slate-500 mt-2 hover:text-blue-600 transition"
      >
        Masuk / Login Guru
      </Link>
    </div>
  );
};

export default FooterLogin;
