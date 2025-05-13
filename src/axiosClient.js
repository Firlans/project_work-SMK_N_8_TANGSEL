import axios from "axios";
import Cookies from "js-cookie";

const port = import.meta.env.VITE_DOMAIN;

const axiosClient = axios.create({
  baseURL: `${port}/api`,
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
  (response) => response,
  (error) => {
    if (error.response) {
      const errorStatus = error.response.data.status;

      // Handle all token-related errors
      if (
        error.response.status === 401 &&
        (errorStatus === "Token is Invalid" ||
          errorStatus === "Token is Expired" ||
          errorStatus === "Authorization Token not found")
      ) {
        console.error("Token error:", errorStatus);

        // Clear authentication
        Cookies.remove("token");
        delete axiosClient.defaults.headers.common["Authorization"];

        // Redirect to login
        window.location.href = "/";
        return Promise.reject(error);
      }

      // Handle invalid credentials separately
      if (
        error.response.status === 401 &&
        errorStatus === "Invalid credentials"
      ) {
        console.warn("Login gagal: Email atau password salah.");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
