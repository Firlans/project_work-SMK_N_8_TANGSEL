import { useEffect, useState, useCallback } from "react";
import {
  fetchChatRoomsByConselor,
  fetchChatRoomsBySiswa,
  fetchChatRoomByAccessCode,
  deleteChatRoom,
  fetchLastMessage,
} from "../../../services/chatRoomService";
import { fetchAllStudents } from "../../../services/chatRoomService";
import ChatRoomCard from "./ChatRoomCard";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

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
      let rawRooms = [];

      if (role === "conselor") {
        const all = await fetchChatRoomsByConselor(idUser);
        rawRooms = all.filter((r) => Boolean(r.is_private) === isPrivate);
      } else if (role === "siswa") {
        if (isPrivate) {
          const accessCode = localStorage.getItem("chat_access_code");
          if (!accessCode) {
            console.warn("No access code found in localStorage.");
            return setRooms([]);
          }
          const result = await fetchChatRoomByAccessCode(accessCode);
          rawRooms = result?.data ? [result.data] : [];
        } else {
          const all = await fetchChatRoomsBySiswa(idUser);
          rawRooms = all.filter((r) => Boolean(r.is_private) === false);
        }
      }

      const siswaList = await fetchAllStudents();

      // Enrich setiap room dengan pesan terakhir + nama siswa
      const enrichedRooms = await Promise.all(
        rawRooms.map(async (room) => {
          const lastMessage = await fetchLastMessage(room.id);

          // Temukan nama siswa berdasarkan user_id
          const siswa = siswaList.find((s) => s.user_id === room.id_user_siswa);

          return {
            ...room,
            lastMessage,
            nama_siswa: siswa?.nama_lengkap ?? null,
          };
        })
      );

      setRooms(enrichedRooms);
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
      onDeleted?.();
    } catch (err) {
      console.error("Gagal hapus", err);
      alert("Gagal hapus");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (rooms.length === 0)
    return (
      <p className="text-center text-slate-900 dark:text-white">
        Belum ada chat room {isPrivate ? "private" : "publik"}
      </p>
    );

  return (
    <div className="flex flex-col gap-5">
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
