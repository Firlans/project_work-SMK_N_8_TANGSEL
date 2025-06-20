import Cookies from "js-cookie";

/**
 * Hook untuk mendeteksi apakah user adalah wali murid yang login sebagai siswa (READ ONLY)
 * @returns {boolean}
 */
const useReadOnlyRole = () => {
  const role = Cookies.get("userRole");
  const asSiswa = Cookies.get("as_siswa") === "true";
  return role === "orang_tua" && asSiswa;
};

export default useReadOnlyRole;
