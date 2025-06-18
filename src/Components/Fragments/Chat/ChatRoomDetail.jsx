import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  getChatMessages,
  sendMessage,
} from "../../../services/chatRoomService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatRoomHeader from "./ChatRoomHeader";
import echo from "../../../utils/echo";
import Cookies from "js-cookie";
import { decryptMessage, encryptMessage } from "../../../utils/encryption";

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
  const bottomRef = useRef(null);
  const user = JSON.parse(Cookies.get("userPrivilege") || "{}");
  const userId = user?.user_id || user?.id;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  // Ambil riwayat chat dari backend
  const fetchMessages = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await getChatMessages(id, 1);
      const sorted = res.data.data
        .filter((msg) => msg.id_chat_room === parseInt(id))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((msg) => ({
          ...msg,
          message: safeDecryptMessage(msg, isPrivate),
        }));
      setMessages(sorted);
    } catch (err) {
      console.error("Gagal ambil pesan:", err);
      setError("Gagal memuat pesan.");
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [id, isPrivate, scrollToBottom]);

  // Real-time listener (Laravel Echo)
  useEffect(() => {
    if (!id) return;
    const channel = echo.private(`room.${id}`);
    console.log("Subscribed to room:", `room.${id}`);

    channel.listen("SendMessageEvent", (e) => {
      console.log("Pesan real-time masuk:", e);

      const newMessage = {
        id: `realtime-${Date.now()}`,
        id_sender: e.sender?.id,
        id_chat_room: e.roomId,
        created_at: new Date().toISOString(),
        sender: e.sender,
        pending: false,
        message: getMessageFromRealtimePayload(e, isPrivate),
      };

      setMessages((prev) => {
        const isDuplicate = prev.some((msg) => {
          const isSameSender = msg.id_sender === newMessage.id_sender;
          const isSameMessage = msg.message === newMessage.message;
          const timeDiff = Math.abs(
            new Date(msg.created_at) - new Date(newMessage.created_at)
          );
          return isSameSender && isSameMessage && timeDiff < 5000;
        });
        return isDuplicate ? prev : [...prev, newMessage];
      });

      scrollToBottom();
    });

    return () => {
      channel.stopListening("SendMessageEvent");
      echo.leave(`room.${id}`);
    };
  }, [id, isPrivate, scrollToBottom]);

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

      if (res?.data) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === tempId
              ? {
                  ...res.data,
                  tempId,
                  pending: false,
                  message: text,
                  sender: user,
                }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("Gagal kirim pesan:", err);
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

  return (
    <div className="w-full max-w-4xl mx-auto h-[90vh] p-4 md:p-6 flex flex-col">
      <div className="bg-white rounded-2xl shadow-lg flex flex-col h-full">
        <ChatRoomHeader chatRoomId={id} isPrivate={isPrivate} />
        <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50/30 scroll-smooth">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 italic">Memuat pesan...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Belum ada pesan.</p>
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
        <div className="px-4 py-3 border-t border-gray-100 bg-white rounded-b-2xl">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
