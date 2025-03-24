import { useState } from "react";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input/Index";
import axiosClient from "../../axiosClient.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const FormLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email dan password harus diisi!");
      return;
    }

    try {
      const response = await axiosClient.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data.data;
      // debugging;
      console.log("Login berhasil:", response.data);
      console.log("Role:", user.role);

      // Simpan token di cookie
      Cookies.set("token", token, {
        expires: 1,
        secure: false, // Set to true jika sudah di deploy dengan HTTPS
        sameSite: "Strict",
      });
      Cookies.set("userRole", user.role, {
        expires: 1,
        secure: false, // Set to true jika sudah di deploy dengan HTTPS
        sameSite: "Strict",
      });

      // Set token di axios
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect berdasarkan role
      navigate(`/dashboard-${user.role}`);
    } catch (error) {
      console.error("Login gagal:", error.response?.data);

      const errorMessage =
        error.response?.data?.error === "Invalid credentials"
          ? "Email atau password salah"
          : error.response?.data?.error || "Terjadi kesalahan, coba lagi.";

      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Tampilkan error jika ada */}
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
      <Button className="bg-yellow-600 text-white" type="submit">
        Login
      </Button>
    </form>
  );
};

export default FormLogin;
