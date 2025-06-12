import { useEffect, useState } from "react";
import {
  fetchChatRoomsByConselor,
  fetchChatRoomsBySiswa,
} from "../../../services/chatRoomService";
import ChatRoomCard from "./ChatRoomCard";

const ChatRoomList = ({ role, idUser, isPrivate = false, refreshKey }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
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
    };

    loadRooms();
  }, [role, idUser, isPrivate, refreshKey]); // refreshKey ditambahkan

  if (loading) return <p className="text-center">Loading chat rooms...</p>;

  if (rooms.length === 0)
    return (
      <p className="text-center text-gray-400">
        Belum ada chat room {isPrivate ? "private" : "publik"}
      </p>
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <ChatRoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default ChatRoomList;
