import { useEffect, useState } from "react";
import { getChatRoomById } from "../../../services/chatRoomService";
import Cookies from "js-cookie";
import axiosClient from "../../../axiosClient";
import { IoChevronBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ChatRoomHeader = ({ chatRoomId, isPrivate = false }) => {
  const [room, setRoom] = useState(null);
  const [siswaName, setSiswaName] = useState("");
  const [konselorName, setKonselorName] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // ✨

  const user = JSON.parse(Cookies.get("userPrivilege") || "{}");
  const navigate = useNavigate();

  // Ambil data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getChatRoomById(chatRoomId);
        const data = res.data;
        setRoom(data);

        if (data?.id_user_siswa && !(isPrivate && user?.is_conselor)) {
          const siswaRes = await axiosClient.get(
            `/siswa/${data.id_user_siswa}`
          );
          const siswa = siswaRes.data.data;
          setSiswaName(siswa.nama_lengkap);
          setProfileData(siswa);
        }

        if (data?.id_user_guru) {
          const konselorRes = await axiosClient.get(
            `/guru/${data.id_user_guru}`
          );
          const konselor = konselorRes.data.data;
          setKonselorName(konselor.nama);
          setProfileData(konselor);
        }
      } catch (err) {
        console.error("Gagal ambil info chat room:", err);
      }
    };

    fetchData();
  }, [chatRoomId, isPrivate, user?.is_conselor]);

  // Disable scroll saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = showProfile ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showProfile]);

  // ✨ Modal Close Handler (with animation)
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowProfile(false);
      setIsClosing(false);
    }, 400); // Match with fadeOut duration
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 border-b dark:border-gray-700 rounded-t-2xl transition-colors duration-300">
      <div className="py-3 px-4">
        <div className="flex items-center gap-4">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Kembali"
          >
            <IoChevronBackSharp
              size={20}
              className="text-gray-600 dark:text-gray-300"
            />
          </button>

          {/* Trigger Modal */}
          <button
            onClick={() => setShowProfile(true)}
            className="cursor-pointer bg-gradient-to-br from-blue-100 to-blue-200 dark:from-indigo-600 dark:to-indigo-700 p-2.5 rounded-xl transition-transform duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
            aria-label="Lihat Profil"
          >
            <svg
              className="w-6 h-6 text-blue-600 dark:text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 
                  1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 
                  21l2.755-4.133a1.14 1.14 0 01.865-.501c1.153-.086 
                  2.294-.213 3.423-.379 1.584-.233 2.707-1.626 
                  2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 
                  48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 
                  3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
          </button>

          {/* Nama dan status */}
          <div className="flex-1">
            <h2 className="text-base font-medium text-gray-800 dark:text-white transition-colors">
              {room?.name || "Tanpa Judul"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 transition-colors">
              {user?.is_conselor ? (
                isPrivate ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Siswa Anonim
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    {siswaName || "Memuat..."}
                  </span>
                )
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  {konselorName || "Memuat..."}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {showProfile && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-sm transition-all 
              ${isClosing ? "animate-fadeOut" : "animate-fadeInUp"}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 bg-blue-100 dark:bg-indigo-700 rounded-full flex items-center justify-center text-blue-600 dark:text-white">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 14c1.657 0 3-1.567 3-3.5S13.657 7 12 7s-3 1.567-3 3.5 1.343 3.5 3 3.5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.5 20h11a1.5 1.5 0 001.5-1.5v-1a4 4 0 00-4-4H9a4 4 0 00-4 4v1A1.5 1.5 0 006.5 20z"
                  />
                </svg>
              </div>
              <h3
                id="modal-title"
                className="text-lg font-semibold text-gray-800 dark:text-white mb-2"
              >
                Info Profil
              </h3>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            {user?.is_conselor ? (
              isPrivate ? (
                <p className="text-gray-500 dark:text-gray-300 text-center">
                  Siswa Anonim
                </p>
              ) : (
                <>
                  <p className="text-gray-800 dark:text-white">
                    <strong>Nama:</strong> {profileData?.name || siswaName}
                  </p>
                  <p className="text-gray-800 dark:text-white">
                    <strong>Kelas:</strong> {profileData?.kelas?.name || "-"}
                  </p>
                  <p className="text-gray-800 dark:text-white">
                    <strong>NIS:</strong> {profileData?.nis || "-"}
                  </p>
                </>
              )
            ) : (
              <>
                <p className="text-gray-800 dark:text-white">
                  <strong>Nama:</strong> {profileData?.name || konselorName}
                </p>
                <p className="text-gray-800 dark:text-white">
                  <strong>NIP:</strong> {profileData?.nip || "-"}
                </p>
              </>
            )}

            <button
              onClick={handleCloseModal}
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoomHeader;
