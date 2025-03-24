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
      if (
        error.response.status === 401 ||
        error.response.data.status === "Token is Expired"
      ) {
        console.error("Token expired, logging out...");

        // Hapus token dari cookies
        Cookies.remove("token");

        // Redirect user ke halaman login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
