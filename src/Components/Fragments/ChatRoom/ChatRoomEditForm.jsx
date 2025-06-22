import Modal from "react-modal";
import { useState, useEffect } from "react";
import { updateChatRoom } from "../../../services/chatRoomService";

const ChatRoomEditForm = ({ isOpen, onClose, room, onUpdated }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Open");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setName(room.name || "");
      setStatus(room.status || "Open");
    }
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!room) return;

    setLoading(true);
    try {
      await updateChatRoom(room.id, {
        name,
        status,
        id_user_guru: room.id_user_guru,
        id_user_siswa: room.id_user_siswa,
        is_private: room.is_private,
        access_code: room.access_code || "",
      });

      onUpdated?.();
      onClose();
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
      className="bg-white dark:bg-gray-700 max-w-md mx-auto mt-32 p-6 rounded-xl shadow-xl transition-colors duration-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white transition-colors">
        Edit Chat Room
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Chat Room */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            Nama Chat Room
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
            disabled
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all"
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Aksi */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white dark:text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChatRoomEditForm;
