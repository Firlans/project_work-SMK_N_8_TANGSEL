import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ChatRoomCard = ({ room, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();

  const role = Cookies.get("userRole");
  const baseRoute =
    role === "konselor" ? "/dashboard-konselor" : "/dashboard-siswa";

  const handleClick = () => {
    navigate(`${baseRoute}/konseling/public/chat-room/${room.id}`);
  };

  return (
    <div
      className="p-4 border rounded-lg shadow hover:shadow-md bg-white relative cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleClick} // ← Ini yang bener!
    >
      <h3 className="text-lg font-bold text-gray-800">
        {room.name || "Tanpa Nama"}
      </h3>
      <p>Siswa: {room.id_user_siswa}</p>

      {showActions && (
        <div
          className="absolute top-2 right-2 flex gap-2"
          onClick={(e) => e.stopPropagation()} // ← Supaya klik Edit/Hapus gak trigger `navigate`
        >
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => onEdit(room)}
          >
            Edit
          </button>
          <button
            className="text-sm text-red-600 hover:underline"
            onClick={() => onDelete(room)}
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoomCard;
