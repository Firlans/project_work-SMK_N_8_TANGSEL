import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEdit, FaTrash } from "react-icons/fa";

const ChatRoomCard = ({ room, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const role = Cookies.get("userRole");
  const baseRoute =
    role === "konselor" ? "/dashboard-konselor" : "/dashboard-siswa";

  const handleClick = () => {
    if (!room.id) {
      console.warn("Room ID undefined!", room);
      return;
    }
    const routeType = room.is_private ? "private" : "public";
    navigate(`${baseRoute}/konseling/${routeType}/chat-room/${room.id}`);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 relative transition-all duration-300 ease-in-out"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white truncate transition-colors">
            {room.name || "Tanpa Nama"}
          </h3>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors duration-300 ${
              room.status === "Open"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-800/40 dark:text-rose-300"
            }`}
          >
            {room.status || "Unknown"}
          </span>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-300 whitespace-nowrap transition-colors">
          {formatTime(room.lastMessage?.created_at)}
        </span>
      </div>

      {/* Subinfo */}
      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 transition-colors">
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-100">
            Siswa:
          </span>{" "}
          {room.is_private ? "Anonim" : room.nama_siswa || "Tidak Diketahui"}
        </p>
        <p className="text-gray-500 dark:text-gray-400 italic truncate transition-colors">
          {room.lastMessage?.message || "Belum ada pesan"}
        </p>
      </div>

      {/* Action Buttons */}
      <div
        className="absolute bottom-3 right-3 flex gap-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 text-lg transition-all"
          onClick={() => onEdit(room)}
        >
          <FaEdit />
        </button>
        <button
          className="text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 text-lg transition-all"
          onClick={() => onDelete(room)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ChatRoomCard;
