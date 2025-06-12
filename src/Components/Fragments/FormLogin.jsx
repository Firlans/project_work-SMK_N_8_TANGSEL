import { useState } from "react";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input/Index";
import axiosClient from "../../axiosClient.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const FormLogin = ({ role }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loginType, setLoginType] = useState("email");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLoginTypeChange = (event) => {
    setLoginType(event.target.value);
    setFormData({ ...formData, identifier: "" }); // Kosongin input kalau ganti tipe
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.identifier || !formData.password) {
      setError("Semua field harus diisi!");
      setIsLoading(false);
      return;
    }

    try {
      let endpoint = "";
      let payload = { password: formData.password };

      if (loginType === "email") {
        endpoint = "/login";
        payload.email = formData.identifier;
      } else if (loginType === "nisn") {
        endpoint = "/login/nisn";
        payload.nisn = formData.identifier;
      } else if (loginType === "nip") {
        endpoint = "/login/nip";
        payload.nip = formData.identifier;
      }

      const response = await axiosClient.post(endpoint, payload);

      const { token, privilege } = response.data.data;

      const allowedRoles = {
        siswa: ["is_siswa"],
        guru: ["is_guru"],
        konselor: ["is_conselor"],
        admin: ["is_admin", "is_superadmin"],
      };

      const allowedPrivileges = allowedRoles[role];
      const hasAccess = allowedPrivileges?.some((key) => privilege[key] === 1);

      if (!hasAccess) {
        setError("Anda tidak memiliki akses ke halaman ini.");
        setIsLoading(false);
        return;
      }

      Cookies.set("userPrivilege", JSON.stringify(privilege), { expires: 1 });
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("userRole", role, { expires: 1 });

      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (privilege.is_superadmin === 1 && role === "admin") {
        navigate("/dashboard-admin");
      } else {
        navigate(`/dashboard-${role}`);
      }
    } catch (error) {
      const message = error.response?.data?.message?.toLowerCase();

      if (message?.includes("invalid credential")) {
        let fieldType = "Email";
        if (loginType === "nisn") fieldType = "NISN";
        if (loginType === "nip") fieldType = "NIP";

        setError(`${fieldType} atau password salah`);
      } else {
        setError(message || "Terjadi kesalahan, coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="relative space-y-4">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">Logging in...</p>
          </div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {["siswa", "guru", "admin", "konselor"].includes(role) && (
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm text-slate-500 font-medium">
            Login dengan:
          </label>

          <div className="relative w-full h-10 bg-gray-200 rounded-full flex items-center px-1 shadow-inner">
            {/* Sliding indicator */}
            <div
              className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-8 bg-yellow-600 rounded-full transition-all duration-300
        ${loginType === "email" ? "translate-x-0" : "translate-x-full"}
        ring-2 ring-yellow-700 ring-offset-1`}
            />

            {/* Email Button */}
            <button
              type="button"
              onClick={() => setLoginType("email")}
              className={`relative z-10 w-1/2 h-8 rounded-full text-sm font-semibold transition-all duration-300
        focus:outline-none
        ${
          loginType === "email"
            ? "text-white"
            : "text-gray-700 hover:text-yellow-700"
        }`}
            >
              Email
            </button>

            {/* NISN / NIP Button */}
            <button
              type="button"
              onClick={() => setLoginType(role === "siswa" ? "nisn" : "nip")}
              className={`relative z-10 w-1/2 h-8 rounded-full text-sm font-semibold transition-all duration-300
        focus:outline-none
        ${
          loginType !== "email"
            ? "text-white"
            : "text-gray-700 hover:text-yellow-700"
        }`}
            >
              {role === "siswa" ? "NISN" : "NIP"}
            </button>
          </div>
        </div>
      )}

      <InputForm
        label={
          loginType === "email"
            ? "Email"
            : loginType === "nisn"
            ? "NISN"
            : "NIP"
        }
        type="text"
        placeholder={`Masukkan ${
          loginType === "email"
            ? "Email"
            : loginType === "nisn"
            ? "NISN"
            : "NIP"
        }`}
        name="identifier"
        value={formData.identifier}
        onChange={handleChange}
      />

      <InputForm
        label="Password"
        type="password"
        placeholder="******"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="flex justify-between items-center">
        <Button
          type="button"
          onClick={() => navigate("/")}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Kembali
        </Button>

        <Button
          type="submit"
          className="bg-yellow-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
};

export default FormLogin;
