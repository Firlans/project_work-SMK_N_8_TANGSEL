import { jwtDecode } from "jwt-decode";

export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const decodeToken = (token) => jwtDecode(token);
export const isTokenExpired = (token) => {
  try {
    const exp = JSON.parse(atob(token.split(".")[1])).exp;
    return Date.now() / 1000 > exp;
  } catch {
    return true;
  }
};
