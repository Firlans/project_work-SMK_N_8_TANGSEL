import { useEffect, useState, useCallback } from "react";
import {
  fetchChatRoomsByConselor,
  fetchChatRoomsBySiswa,
  deleteChatRoom,
} from "../../../services/chatRoomService";
import ChatRoomCard from "./ChatRoomCard";

const ChatRoomList = ({
  role,
  idUser,
  isPrivate = false,
  refreshKey,
  onEdit,
  onDeleted,
}) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      let data = [];

      if (role === "conselor") {
        data = await fetchChatRoomsByConselor(idUser);
      } else if (role === "siswa") {
        data = await fetchChatRoomsBySiswa(idUser);
      }

      const filtered = data.filter(
        (room) => Boolean(room.is_private) === isPrivate
      );
      setRooms(filtered);
    } catch (err) {
      console.error("Gagal load chat room:", err);
    } finally {
      setLoading(false);
    }
  }, [role, idUser, isPrivate]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms, refreshKey]);

  const handleDelete = async (room) => {
    const confirm = window.confirm("Yakin ingin menghapus chat room ini?");
    if (!confirm) return;
    try {
      await deleteChatRoom(room.id);
      onDeleted?.(); // kasih tahu parent buat refresh
    } catch (err) {
      console.error("Gagal hapus", err);
      alert("Gagal hapus");
    }
  };

  if (loading) return <p className="text-center">Loading chat rooms...</p>;

  if (rooms.length === 0)
    return (
      <p className="text-center text-gray-400">
        Belum ada chat room {isPrivate ? "private" : "publik"}
      </p>
    );

  return (
    <div className="flex flex-col gap-4">
      {rooms.map((room) => (
        <ChatRoomCard
          key={room.id}
          room={room}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default ChatRoomList;
