import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const token = Cookies.get("token");
if (token) {
  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Interceptor untuk menangani token expired
axiosClient.interceptors.response.use(
  (response) => response, // Jika sukses, langsung kembalikan response
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data.status;

      // Jika token expired, hapus token dan logout otomatis
      if (error.response.status === 401 && errorMessage === "Token is Expired") {
        console.error("Token expired, logging out...");

        Cookies.remove("token");
        window.location.href = "/login"; // Redirect hanya jika token expired
      }

      // Jika hanya login gagal, JANGAN hapus token & redirect
      if (error.response.status === 401 && errorMessage === "Invalid credentials") {
        console.warn("Login gagal: Email atau password salah.");
        return Promise.reject(error); // Teruskan error ke catch() di handleLogin
      }
    }
    return Promise.reject(error); // Tetap teruskan error lainnya
  }
);


export default axiosClient;
