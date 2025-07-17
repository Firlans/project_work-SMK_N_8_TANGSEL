import { useState } from "react";
import axiosClient from "../../axiosClient";
import InputForm from "../../Components/Elements/Input/Index";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/Elements/Loading/LoadingSpinner";
import { FaCheck } from "react-icons/fa6";

const OrangTuaForm = () => {
  const [loginType, setLoginType] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [nisn, setNisn] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const endpoint =
        loginType === "email"
          ? "/login/orang-tua/email"
          : "/login/orang-tua/wa";

      const payload =
        loginType === "email"
          ? { email: identifier, nisn }
          : { no_telp: identifier, nisn };

      await axiosClient.post(endpoint, payload);
      setMessage(
        loginType === "email"
          ? "✅ Link akses telah dikirim via Email terdaftar!"
          : "✅ Link akses telah dikirim via WhatsApp terdaftar!"
      );
    } catch (error) {
      setMessage("❌ Gagal mengirim link. Cek kembali data Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setIdentifier("");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg-landing.jpg')", // ganti sesuai path
        }}
      />

      {/* Overlay blue & blur */}
      <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm" />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40">
          <LoadingSpinner text="Sedang mengirim link..." />
        </div>
      )}

      {/* Form Box */}
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-xl shadow-xl space-y-6 transition-all duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-sm text-gray-500">
            Selamat Datang, silakan isi data di bawah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Login Type Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600 font-medium">
              Login dengan:
            </label>

            <div className="relative w-full h-10 bg-gray-200 rounded-full flex items-center px-1 shadow-inner">
              <div
                className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-8 bg-yellow-600 rounded-full transition-all duration-300
                ${loginType === "email" ? "translate-x-0" : "translate-x-full"}
                ring-2 ring-yellow-700 ring-offset-1`}
              />
              <button
                type="button"
                onClick={() => handleLoginTypeChange("email")}
                className={`relative z-10 w-1/2 h-8 rounded-full text-sm font-semibold transition-all
                ${
                  loginType === "email"
                    ? "text-white"
                    : "text-gray-700 hover:text-yellow-700"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => handleLoginTypeChange("no_telp")}
                className={`relative z-10 w-1/2 h-8 rounded-full text-sm font-semibold transition-all
                ${
                  loginType === "no_telp"
                    ? "text-white"
                    : "text-gray-700 hover:text-yellow-700"
                }`}
              >
                No WhatsApp
              </button>
            </div>
          </div>

          <InputForm
            label={loginType === "email" ? "Email" : "No WhatsApp"}
            labelColor="text-slate-900"
            type={loginType === "email" ? "email" : "tel"}
            placeholder={
              loginType === "email" ? "Masukkan Email" : "Masukkan No WhatsApp"
            }
            name="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <InputForm
            label="NISN Anak"
            type="text"
            placeholder="Masukkan NISN Anak"
            name="nisn"
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
          />

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md shadow transition-all"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-1/2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-md shadow transition-all"
            >
              Kirim Link Akses
            </button>
          </div>

          {message && (
            <p className="text-center text-sm text-gray-600 transition-all">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrangTuaForm;
