import { useState } from "react";

const ChatRoomCard = ({ room, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="p-4 border rounded-lg shadow hover:shadow-md bg-white relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <h3 className="text-lg font-bold text-gray-800">
        {room.name || "Tanpa Nama"}
      </h3>
      {/* <p className="text-sm text-gray-600">
        Status: {room.status === "Open" ? "🟢 Open" : "🔴 Closed"}
      </p> */}
      <p>Siswa: {room.id_user_siswa}</p>

      {showActions && (
        <div className="absolute top-2 right-2 flex gap-2">
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
