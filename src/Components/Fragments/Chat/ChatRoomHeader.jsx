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
  const user = JSON.parse(Cookies.get("userPrivilege") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getChatRoomById(chatRoomId);
        const data = res.data;
        setRoom(data);

        if (data?.id_user_siswa && !(isPrivate && user?.is_conselor)) {
          const siswaRes = await axiosClient.get(`/user/${data.id_user_siswa}`);
          setSiswaName(siswaRes.data.data.name);
        }

        if (data?.id_user_guru) {
          const konselorRes = await axiosClient.get(
            `/user/${data.id_user_guru}`
          );
          setKonselorName(konselorRes.data.data.name);
        }
      } catch (err) {
        console.error("Gagal ambil info chat room:", err);
      }
    };

    fetchData();
  }, [chatRoomId, isPrivate]);

  return (
    <div className="relative bg-white border-b rounded-t-2xl">
      <div className="py-3 px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Kembali"
          >
            <IoChevronBackSharp size={20} className="text-gray-600" />
          </button>

          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2.5 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h2 className="text-base font-medium text-gray-800">
              {room?.name || "Tanpa Judul"}
            </h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              {user?.is_conselor ? (
                isPrivate ? (
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Siswa Anonim
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    {siswaName || "Memuat..."}
                  </span>
                )
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  {konselorName || "Memuat..."}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomHeader;
