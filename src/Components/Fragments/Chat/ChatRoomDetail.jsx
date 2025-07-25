import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  fetchUsersById,
  getChatMessages,
  getChatRoomById,
  sendMessage,
} from "../../../services/chatRoomService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatRoomHeader from "./ChatRoomHeader";
import Cookies from "js-cookie";
import { decryptMessage, encryptMessage } from "../../../utils/encryption";
import { generateNewMessageNotificationEmail } from "../../../utils/emailNewMessage";
import { sendEmailNotification } from "../../../services/emailService";

// Dekripsi aman (untuk pesan lama)
const safeDecryptMessage = (msg, isPrivate) => {
  if (!isPrivate) return msg.message;
  try {
    if (!msg.encrypted_message) return msg.message;
    return decryptMessage(msg.encrypted_message);
  } catch {
    return msg.message;
  }
};

// Ambil pesan dari real-time event
const getMessageFromRealtimePayload = (e, isPrivate) => {
  const msg = e.message;

  if (!msg) return "";

  const isObject =
    typeof msg === "object" && (msg.encrypt_text || msg.plain_text);

  if (isObject) {
    if (isPrivate) {
      try {
        return decryptMessage(msg.encrypt_text);
      } catch {
        return msg.plain_text || "";
      }
    } else {
      return msg.plain_text || "";
    }
  }

  if (typeof msg === "string") return msg;

  return "";
};

const ChatRoomDetail = ({ isPrivate = false }) => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatRoomInfo, setChatRoomInfo] = useState(null);
  const [targetUserEmail, setTargetUserEmail] = useState(null);
  const [targetUserName, setTargetUserName] = useState(null);

  const bottomRef = useRef(null);
  const user = useMemo(
    () => JSON.parse(Cookies.get("userPrivilege") || "{}"),
    []
  );
  const userId = user?.id_user;
  const userProfile = Cookies.get("userRole");
  const userName = Cookies.get("name");

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  const sendNewMessageEmail = useCallback(
    async (
      messageContent,
      senderName,
      currentChatRoomInfo,
      recipientEmail,
      recipientName
    ) => {
      if (!currentChatRoomInfo || !recipientEmail) {
        console.warn("GAGAL KIRIM EMAIL");
        console.warn("chatRoomInfo:", currentChatRoomInfo);
        console.warn("recipientEmail:", recipientEmail);
        return;
      }

      try {
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

        const roomTypeDisplay = currentChatRoomInfo.is_private
          ? "Private"
          : "Public";
        const subject = `Pesan Baru di ${currentChatRoomInfo.name}! - ${formattedDateTime}`;

        const emailHtml = generateNewMessageNotificationEmail({
          chatRoomName: currentChatRoomInfo.name,
          senderName: senderName,
          messageContent: messageContent,
          roomType: roomTypeDisplay,
          timestamp: formattedDateTime,
        });

        await sendEmailNotification(recipientEmail, subject, emailHtml);
        console.log(
          `Notifikasi email pesan baru berhasil dikirim ke ${recipientName} (${recipientEmail})`
        );
      } catch (emailErr) {
        console.error("Gagal mengirim notifikasi email pesan baru:", emailErr);
      }
    },
    [id]
  );

  // Ambil riwayat chat dari backend
  const fetchMessages = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const [messagesRes, chatRoomRes] = await Promise.all([
        getChatMessages(id, 1),
        getChatRoomById(id),
      ]);

      const sortedMessages = messagesRes.data.data
        .filter((msg) => msg.id_chat_room === parseInt(id))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((msg) => ({
          ...msg,
          message: safeDecryptMessage(msg, isPrivate),
        }));
      setMessages(sortedMessages);

      const roomInfo = chatRoomRes?.data;
      setChatRoomInfo(roomInfo);

      // Tentukan lawan bicara (penerima email)
      let recipientId = null;
      if (userProfile === "konselor") {
        recipientId = roomInfo.id_user_siswa;
      } else if (userProfile === "siswa") {
        recipientId = roomInfo.id_user_guru;
      }

      if (!recipientId) {
        console.warn("Recipient ID tidak ditemukan.");
        return;
      }

      const recipientDetail = await fetchUsersById(recipientId);
      if (!recipientDetail) {
        console.warn("Gagal ambil detail user:", recipientId);
        return;
      }

      setTargetUserEmail(recipientDetail.email);
      setTargetUserName(recipientDetail.name);
    } catch (err) {
      setError("Gagal memuat pesan.");
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [id, isPrivate, scrollToBottom, user]);

  // Real-time listener (Laravel Echo)
  useEffect(() => {
    if (!window.Echo) {
      return;
    }

    if (!id) return;

    const channel = window.Echo.private(`room.${id}`);

    channel.listen("SendMessageEvent", async (e) => {
      // Dapatkan pesan dari payload real-time
      const realTimeMessageContent = getMessageFromRealtimePayload(
        e,
        isPrivate
      );

      // {
      // // Tentukan pengirim pesan real-time
      // const eventSenderId = e.sender?.id;

      // // Jika pesan berasal dari BUKAN user yang sedang login, kirim notifikasi
      // if (
      //   eventSenderId !== userId &&
      //   !(isPrivate && userProfile === "konselor")
      // ) {
      //   const senderName = isPrivate
      //     ? "Siswa Anonim"
      //     : e.sender?.name || "Pengirim Tak Dikenal";

      //   if (chatRoomInfo && targetUserEmail) {
      //     await sendNewMessageEmail(
      //       realTimeMessageContent,
      //       senderName,
      //       chatRoomInfo,
      //       targetUserEmail,
      //       targetUserName
      //     );
      //   } else {
      //     console.warn(
      //       "Tidak dapat mengirim notifikasi email: chatRoomInfo atau targetUserEmail belum tersedia."
      //     );
      //   }
      // }
      // }

      setMessages((prev) => {
        // Cari apakah ada pesan 'pending' dengan konten yang sama
        // atau tempId yang cocok dari sender yang sama
        const existingMessageIndex = prev.findIndex(
          (msg) =>
            msg.pending &&
            msg.id_sender === e.sender?.id &&
            msg.message === realTimeMessageContent
        );

        if (existingMessageIndex !== -1) {
          // Jika ditemukan pesan pending, perbarui pesan tersebut dengan data final dari backend
          const updatedMessages = [...prev];
          updatedMessages[existingMessageIndex] = {
            ...e.message, // Gunakan data lengkap dari event jika tersedia
            id: e.message?.id || updatedMessages[existingMessageIndex].id, // Pastikan ID dari backend digunakan
            tempId: updatedMessages[existingMessageIndex].tempId, // Pertahankan tempId untuk referensi jika perlu
            id_sender: e.sender?.id,
            id_chat_room: e.roomId,
            created_at: e.message?.created_at || new Date().toISOString(),
            sender: e.sender,
            pending: false, // Setel pending menjadi false
            message: realTimeMessageContent,
          };
          return updatedMessages;
        } else {
          // Jika tidak ada pesan pending yang cocok, tambahkan sebagai pesan baru
          const newMessage = {
            id: e.message?.id || `realtime-${Date.now()}`,
            id_sender: e.sender?.id,
            id_chat_room: e.roomId,
            created_at: e.message?.created_at || new Date().toISOString(),
            sender: e.sender,
            pending: false,
            message: realTimeMessageContent,
          };
          return [...prev, newMessage];
        }
      });

      scrollToBottom();
    });

    return () => {
      channel.stopListening("SendMessageEvent");
      window.Echo.leave(`room.${id}`);
    };
  }, [
    id,
    isPrivate,
    scrollToBottom,
    userId,
    chatRoomInfo,
    targetUserEmail,
    targetUserName,
    sendNewMessageEmail,
  ]);

  // Kirim pesan ke backend
  const handleSend = async (text) => {
    if (!text.trim()) return;

    const tempId = `tmp-${Date.now()}`;
    const encrypted = isPrivate ? encryptMessage(text) : "";

    const tempMessage = {
      id: tempId,
      tempId,
      message: text,
      id_sender: userId,
      id_chat_room: parseInt(id),
      created_at: new Date().toISOString(),
      sender: user,
      pending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    scrollToBottom();

    try {
      const payload = {
        id_chat_room: parseInt(id),
        id_sender: userId,
        is_read: false,
      };

      if (isPrivate) {
        payload.message = "";
        payload.encrypted_message = encrypted;
      } else {
        payload.message = text;
      }

      const res = await sendMessage(payload);

      // --- Kirim notifikasi email setelah pesan dikirim (dari sisi pengirim) ---
      // Pesan dikirim oleh user yang sedang login, notifikasi dikirim ke targetUserEmail
      if (res?.data && !(isPrivate && userProfile === "konselor")) {
        await sendNewMessageEmail(
          text,
          isPrivate ? "Siswa Anonim" : userName,
          chatRoomInfo,
          targetUserEmail,
          targetUserName
        );
      }
      // --- Akhir notifikasi ---
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...msg, error: true } : msg
        )
      );
    }
  };

  // Load awal
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  if (loading && !chatRoomInfo) {
    // Tampilkan loading sampai chatRoomInfo terisi
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-gray-400 dark:text-gray-300 italic">
          Memuat chat...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-[90vh] p-4 md:p-6 flex flex-col">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col h-full transition-colors duration-300">
        <ChatRoomHeader chatRoomId={id} isPrivate={isPrivate} />

        <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 dark:bg-gray-800/70 scroll-smooth transition-colors duration-300">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 dark:text-gray-300 italic transition-colors">
                Memuat pesan...
              </p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada pesan.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.tempId || msg.id}
                  message={msg}
                  userId={userId}
                  isPending={msg.pending}
                  hasError={msg.error}
                />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl transition-colors">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
