import Modal from "react-modal";
import { useState, useEffect } from "react";
import { updateChatRoom } from "../../../services/chatRoomService";

const ChatRoomEditForm = ({ isOpen, onClose, room, onUpdated }) => {
  const [name, setName] = useState("");
  const [isOpenRoom, setIsOpenRoom] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setName(room.name || "");
      setIsOpenRoom(room.is_open ? 1 : 0);
    }
    console.log("Modal render, isOpen:", isOpen, "room:", room);
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!room) return;

    setLoading(true);
    try {
      await updateChatRoom(room.id, {
        name,
        is_open: isOpenRoom,
        id_user_guru: room.id_user_guru,
        id_user_siswa: room.id_user_siswa,
        is_private: room.is_private,
        access_code: room.access_code || "",
      });

      onUpdated?.(); // refresh list
      onClose(); // tutup modal
    } catch (err) {
      console.error("Gagal update chat room", err);
      alert("Gagal update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white max-w-md mx-auto mt-32 p-6 rounded-xl shadow-xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">Edit Chat Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nama Chat Room</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={isOpenRoom}
            onChange={(e) => setIsOpenRoom(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value={1}>Open</option>
            <option value={0}>Closed</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChatRoomEditForm;
