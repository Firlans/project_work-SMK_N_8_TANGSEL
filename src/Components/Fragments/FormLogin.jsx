import { useState } from "react";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input/Index";
import axiosClient from "../../axiosClient.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const FormLogin = ({ role }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email dan password harus diisi!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosClient.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, privilege } = response.data.data;

      // Batasan role yang diizinkan per halaman login
      const allowedRoles = {
        siswa: ["is_siswa"],
        guru: ["is_guru"],
        conselor: ["is_conselor"],
        admin: ["is_admin", "is_superadmin"],
      };

      const allowedPrivileges = allowedRoles[role];

      // Cek apakah user punya privilege yang sesuai dengan halaman login
      const hasAccess = allowedPrivileges?.some((key) => privilege[key] === 1);

      if (!hasAccess) {
        setError("Anda tidak memiliki akses ke halaman ini.");
        setIsLoading(false);
        return;
      }

      // Simpan token & role ke cookie
      Cookies.set("token", token, {
        expires: 1,
        secure: false, // Set to true jika sudah di deploy dengan HTTPS
        sameSite: "Strict",
      });

      Cookies.set("userRole", role, {
        expires: 1,
        secure: false, // Set to true jika sudah di deploy dengan HTTPS
        sameSite: "Strict",
      });

      // Set token untuk axios
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Arahkan ke dashboard yang sesuai
      if (privilege.is_superadmin === 1 && role === "admin") {
        navigate("/dashboard-admin");
      } else {
        navigate(`/dashboard-${role}`);
      }
    } catch (error) {
      console.error("Login gagal:", error.response?.data);

      const errorMessage =
        error.response?.data?.error === "Invalid credentials"
          ? "Email atau password salah"
          : error.response?.data?.error || "Terjadi kesalahan, coba lagi.";

      setError(errorMessage);
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

      <InputForm
        label="Email"
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <InputForm
        label="Password"
        type="password"
        placeholder="*****"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <Button
        type="submit"
        className="bg-yellow-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default FormLogin;
