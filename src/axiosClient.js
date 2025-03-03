import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // Sesuaikan dengan URL backend Laravel kamu
  withCredentials: true, // Penting agar cookie CSRF dan session dikirim
});

export default axiosClient;
