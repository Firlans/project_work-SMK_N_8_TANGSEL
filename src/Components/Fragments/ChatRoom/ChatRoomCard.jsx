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
      className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md bg-white relative transition duration-200 ease-in-out"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-medium text-gray-800 truncate">
            {room.name || "Tanpa Nama"}
          </h3>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              room.status === "Open"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {room.status || "Unknown"}
          </span>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {formatTime(room.lastMessage?.created_at)}
        </span>
      </div>

      {/* Subinfo */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium text-gray-700">Siswa:</span>{" "}
          {room.is_private ? "Anonim" : room.nama_siswa || "Tidak Diketahui"}
        </p>
        <p className="text-gray-500 italic truncate">
          {room.lastMessage?.message || "Belum ada pesan"}
        </p>
      </div>

      {/* Always-visible action buttons */}
      <div
        className="absolute bottom-3 right-3 flex gap-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-gray-500 hover:text-blue-600 text-lg"
          onClick={() => onEdit(room)}
        >
          <FaEdit />
        </button>
        <button
          className="text-gray-500 hover:text-red-600 text-lg"
          onClick={() => onDelete(room)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ChatRoomCard;
