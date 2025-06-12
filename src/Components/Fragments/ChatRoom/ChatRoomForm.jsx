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

  const [name, setName] = useState("");
  const [selectedConselor, setSelectedConselor] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [conselors, setConselors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadConselors = async () => {
      try {
        const res = await fetchAllConselors();
        setConselors(res.data);
      } catch (err) {
        console.error("Gagal ambil konselor:", err);
      }
    };

    loadConselors();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedConselor) return alert("Pilih konselor dulu!");
    if (isPrivate && !accessCode) return alert("Masukkan access code!");

    setLoading(true);
    try {
      const payload = {
        name,
        id_user_guru: selectedConselor,
        is_private: isPrivate ? 1 : 0,
        ...(isPrivate
          ? { access_code: accessCode }
          : { id_user_siswa: idSiswa }),
      };

      const res = await createChatRoom(payload);
      onRoomCreated?.(res.data);
      onClose();
    } catch (err) {
      console.error("Gagal buat chat room", err);
      alert("Gagal buat chat room");
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Contoh: Konseling Pribadi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Pilih Konselor</label>
          <select
            value={selectedConselor}
            onChange={(e) => setSelectedConselor(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">-- Pilih Konselor --</option>
            {conselors.map((c) => (
              <option key={c.user_id} value={c.user_id}>
                {c.nama}
              </option>
            ))}
          </select>
        </div>

        {isPrivate && (
          <div>
            <label className="block text-sm font-medium">Access Code</label>
            <input
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Contoh: abcd1234"
              required
            />
          </div>
        )}

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
