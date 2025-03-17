import { useState } from "react";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input/Index";
import axiosClient from "../../axiosClient.js";

const FormLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

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

      console.log("Login berhasil:", response.data);

      // Simpan token JWT ke localStorage
      localStorage.setItem("token", response.data.data.token);

      // Set token di axios untuk request berikutnya
      axiosClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.data.token}`;

      // Redirect ke dashboard
      window.location.href = "/dashboard-siswa";
    } catch (error) {
      console.error("Login gagal:", error.response?.data);
      setError(error.response?.data?.error || "Email atau password salah.");
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
