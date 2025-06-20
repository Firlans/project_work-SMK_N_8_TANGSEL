//OrangTuaForm.jsx
import { useState } from "react";
import axiosClient from "../../axiosClient";
import InputForm from "../../Components/Elements/Input/Index";
import { useNavigate } from "react-router-dom";

const OrangTuaForm = () => {
  const [loginType, setLoginType] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [nisn, setNisn] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Sedang mengirim link...");

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
      setMessage("Link akses telah dikirim!");
    } catch {
      setMessage("Gagal mengirim link. Cek kembali data Anda.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-sm text-gray-500">
            Selamat Datang, silahkan isi data di bawah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Toggle Button */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-500 font-medium">
              Login dengan:
            </label>

            <div className="relative w-full h-10 bg-gray-200 rounded-full flex items-center px-1 shadow-inner">
              <div
                className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-8 bg-yellow-600 rounded-full transition-all duration-300
                  ${
                    loginType === "email" ? "translate-x-0" : "translate-x-full"
                  }
                  ring-2 ring-yellow-700 ring-offset-1`}
              />
              <button
                type="button"
                onClick={() => setLoginType("email")}
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
                onClick={() => setLoginType("no_telp")}
                className={`relative z-10 w-1/2 h-8 rounded-full text-sm font-semibold transition-all
                  ${
                    loginType === "no_telp"
                      ? "text-white"
                      : "text-gray-700 hover:text-yellow-700"
                  }`}
              >
                No Telp
              </button>
            </div>
          </div>

          {/* Input: Email / No Telp */}
          <InputForm
            label={loginType === "email" ? "Email" : "No Telp"}
            type="text"
            placeholder={
              loginType === "email" ? "Masukkan Email" : "Masukkan No Telp"
            }
            name="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          {/* Input: NISN Anak */}
          <InputForm
            label="NISN Anak"
            type="text"
            placeholder="Masukkan NISN Anak"
            name="nisn"
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
          />

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            <button
              type="button"
              className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md shadow transition-all"
              onClick={() => navigate("/")}
            >
              Kembali
            </button>
            <button
              type="submit"
              className="w-1/2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-md shadow transition-all"
            >
              Kirim Link Akses
            </button>
          </div>

          {message && (
            <p className="text-center text-sm text-gray-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrangTuaForm;
