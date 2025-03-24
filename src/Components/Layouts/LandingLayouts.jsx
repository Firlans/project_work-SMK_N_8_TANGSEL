import React from "react";
import { Link } from "react-router-dom";
// import FooterLogin from "../Elements/Footer/FooterLogin";

const LandingLayout = () => {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col space-y-2">
          <img
            src="/images/logo-smkn8tangsel.png"
            alt="Logo SMK Negeri 8"
            className="w-16 h-16"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-blue-600">
            SMK Negeri 8 Kota Tangerang Selatan
          </h1>

          <Link
            to="/login"
            className="block font-medium text-slate-500 mt-2 hover:text-blue-600 transition"
          >
            Masuk / Login
          </Link>
        </div>
      </div>
      {/* <FooterLogin /> */}
    </div>
  );
};

export default LandingLayout;
