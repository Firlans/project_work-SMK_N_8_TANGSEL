import React from "react";
import { Link } from "react-router-dom";
import FooterLogin from "../Elements/Footer/FooterLogin";
// import FooterLogin from "../Elements/Footer/FooterLogin";

const LandingLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-2xl w-full text-center">
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/images/logo-smkn8tangsel.png"
            alt="Logo SMK Negeri 8"
            className="w-20 h-20"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800">
            SMK Negeri 8 Kota Tangerang Selatan
          </h1>
          <p className="text-gray-600">
            Silakan pilih jenis pengguna untuk masuk ke sistem
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
            <Link
              to="/login-siswa"
              className="bg-blue-900 text-white py-2 px-4 rounded-xl hover:bg-blue-800 transition"
            >
              Login Siswa
            </Link>
            <Link
              to="/login-guru"
              className="bg-blue-900 text-white py-2 px-4 rounded-xl hover:bg-blue-800 transition"
            >
              Login Guru
            </Link>
            <Link
              to="/login-konselor"
              className="bg-blue-900 text-white py-2 px-4 rounded-xl hover:bg-blue-800 transition"
            >
              Login Konselor
            </Link>
            <Link
              to="/login-admin"
              className="bg-blue-900 text-white py-2 px-4 rounded-xl hover:bg-blue-800 transition"
            >
              Login Admin
            </Link>
          </div>
          <FooterLogin />
        </div>
      </div>
    </div>
  );
};

export default LandingLayout;
