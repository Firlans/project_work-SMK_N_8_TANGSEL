import { useState } from "react";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input/Index";
import axiosClient from "../../axiosClient.js";

const FormLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // Reset error sebelum mencoba login

    try {
      // 1. Ambil CSRF token dari backend
      await axiosClient.get("/sanctum/csrf-cookie");

      // 2. Kirim data login ke backend
      const response = await axiosClient.post(
        "login",
        {
          email: "johndoe@exampel.com",
          password: "password123",
        },
        {
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login berhasil:", response.data);

      // 3. Redirect ke dashboard jika login sukses
      window.location.href = "/dashboard-siswa";
    } catch (error) {
      console.error("Login gagal:", error.response?.data);
      setError(error.response?.data?.message || "Login gagal. Coba lagi.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Tampilkan error jika ada */}
      <InputForm
        label="Username"
        type="text"
        placeholder="Username"
        name="nisnOrNip"
        value={formData.nisnOrNip}
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
