import { useState, useEffect } from "react";
import Modal from "react-modal";
import Cookies from "js-cookie";
import {
  createChatRoom,
  fetchAllConselors,
  fetchUsersById,
} from "../../../services/chatRoomService";
import { sendEmailNotification } from "../../../services/emailService";
import { generateChatRoomNotificationEmail } from "../../../utils/emailChatRoomTemplates";

const ChatRoomForm = ({
  isOpen,
  onClose,
  onRoomCreated,
  isPrivate = false,
}) => {
  const idSiswa = JSON.parse(Cookies.get("user_id") || "{}");
  const [roomName, setRoomName] = useState("");
  const [selectedConselorId, setSelectedConselorId] = useState("");
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadCounselors = async () => {
      try {
        const res = await fetchAllConselors();
        setCounselors(res.data);
      } catch (err) {
        setError(true);
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

      let guruEmail = "";
      let namaSiswa = "";

      try {
        const guruDetail = await fetchUsersById(selectedConselorId);
        guruEmail = guruDetail.email;
        if (!isPrivate && idSiswa) {
          const siswaDetail = await fetchUsersById(idSiswa);
          namaSiswa = siswaDetail.name;
        }
      } catch (userError) {
        // console.error(
        //   "Gagal mengambil detail email konselor atau nama siswa:",
        //   userError
        // );
        // alert(
        //   "Chat room berhasil dibuat, tetapi gagal mendapatkan email konselor. Notifikasi tidak terkirim."
        // );
        setLoading(false);
        return;
      }

      if (guruEmail) {
        const now = new Date();
        const options = {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };

        let formattedDateTime = now.toLocaleString("id-ID", options);
        formattedDateTime = formattedDateTime.replace(/\./g, ":");

        const subject = `Notifikasi: Chat Room Baru Dibuat! - ${formattedDateTime}`;
        const roomType = isPrivate ? "Private" : "Public";

        const emailTemplate = generateChatRoomNotificationEmail({
          roomName,
          roomType,
          studentName: !isPrivate ? namaSiswa : undefined, // Hanya kirim namaSiswa jika public
        });

        try {
          await sendEmailNotification(guruEmail, subject, emailTemplate);
          // alert("Chat room berhasil dibuat dan notifikasi email dikirim!");
        } catch (emailError) {
          // console.error("Gagal mengirim notifikasi email:", emailError);
          // alert(
          //   "Chat room berhasil dibuat, tetapi gagal mengirim notifikasi email."
          // );
        }
      } else {
        // console.warn(
        //   "Email konselor tidak ditemukan setelah fetch detail user untuk ID:",
        //   selectedConselorId
        // );
        // alert(
        //   "Chat room berhasil dibuat, tetapi email notifikasi tidak dapat dikirim karena email konselor tidak ditemukan."
        // );
      }
    } catch (err) {
      // alert("Gagal membuat chat room. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Buat Chat Room"
      className="bg-white dark:bg-gray-700 max-w-md mx-auto mt-32 p-6 rounded-xl shadow-xl transition-colors duration-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white transition-colors">
        {isPrivate ? "Buat Chat Room Private" : "Buat Chat Room Publik"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Chat Room */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            Nama Chat Room
          </label>
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
            placeholder="Contoh: Konseling Pribadi"
            required
          />
        </div>

        {/* Pilih Konselor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            Pilih Konselor
          </label>
          <select
            value={selectedConselorId}
            onChange={(e) => setSelectedConselorId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-all"
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

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-2">
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
            {loading ? "Membuat..." : "Buat"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChatRoomForm;
