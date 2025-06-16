import { useState, useEffect } from "react";
import Modal from "react-modal";
import Cookies from "js-cookie";
import {
  createChatRoom,
  fetchAllConselors,
} from "../../../services/chatRoomService";

const ChatRoomForm = ({
  isOpen,
  onClose,
  onRoomCreated,
  isPrivate = false,
}) => {
  const user = JSON.parse(Cookies.get("userPrivilege") || "{}");
  const idSiswa = user?.user_id || user?.id;

  const [roomName, setRoomName] = useState("");
  const [selectedConselorId, setSelectedConselorId] = useState("");
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadCounselors = async () => {
      try {
        const res = await fetchAllConselors();
        setCounselors(res.data);
      } catch (err) {
        console.error("Gagal ambil konselor:", err);
      }
    };

    loadCounselors();
  }, [isOpen]);

  const generateAccessCode = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName || !selectedConselorId) {
      return alert("Isi semua form terlebih dahulu!");
    }

    setLoading(true);
    const accessCode = generateAccessCode();
    if (isPrivate) {
      localStorage.setItem("chat_access_code", accessCode);
    }

    const payload = {
      name: roomName,
      id_user_guru: selectedConselorId,
      is_private: isPrivate,
      ...(isPrivate
        ? { access_code: accessCode }
        : { id_user_siswa: idSiswa, access_code: accessCode }),
    };

    try {
      const res = await createChatRoom(payload);
      onRoomCreated?.(res.data);
      onClose();
    } catch (err) {
      console.error("Gagal buat chat room:", err);
      alert("Gagal membuat chat room. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Buat Chat Room"
      className="bg-white max-w-md mx-auto mt-32 p-6 rounded-xl shadow-xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">
        {isPrivate ? "Buat Chat Room Private" : "Buat Chat Room Publik"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nama Chat Room</label>
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Contoh: Konseling Pribadi"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Pilih Konselor</label>
          <select
            value={selectedConselorId}
            onChange={(e) => setSelectedConselorId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">-- Pilih Konselor --</option>
            {counselors.map((c) => (
              <option key={c.user_id} value={c.user_id}>
                {c.nama}
              </option>
            ))}
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
            {loading ? "Membuat..." : "Buat"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChatRoomForm;
