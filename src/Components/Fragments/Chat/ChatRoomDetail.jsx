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

const ChatRoomDetail = ({ isPrivate = false }) => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const bottomRef = useRef(null);
  const user = JSON.parse(Cookies.get("userPrivilege") || "{}");
  const userId = user?.user_id || user?.id;

  // Fungsi scroll ke bawah dengan debounce
  const scrollToBottom = useCallback(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Fungsi untuk memuat pesan
  const fetchMessages = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getChatMessages(id, page);
      const sorted = res.data.data
        .filter((msg) => msg.id_chat_room === parseInt(id))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      setMessages(sorted);
    } catch (err) {
      console.error("❌ Gagal mengambil pesan:", err);
      setError("Gagal memuat pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [id, page, scrollToBottom]);

  // Setup websocket listener
  useEffect(() => {
    if (!id) return;

    const channel = echo.private(`room.${id}`);

    channel.listen("SendMessageEvent", (e) => {
      console.log("Pesan Terkirim:", JSON.stringify(e, null, 2));

      const newMessage = {
        id: `realtime-${Date.now()}`,
        message: e.message,
        id_sender: e.sender.id,
        id_chat_room: e.roomId,
        created_at: new Date().toISOString(),
        sender: e.sender,
        pending: false,
      };

      setMessages((prev) => {
        // Cek duplikasi dengan lebih detail
        const isDuplicate = prev.some((msg) => {
          const isDuplicateContent = msg.message === e.message;
          const isSameSender = msg.id_sender === e.sender.id;
          const isRecent =
            Math.abs(new Date(msg.created_at) - new Date()) < 3000; // 3 detik
          const isPendingMessage = msg.pending === true;

          const duplicateCheck = {
            content: isDuplicateContent,
            sender: isSameSender,
            recent: isRecent,
            pending: isPendingMessage,
          };

          return (
            isDuplicateContent && isSameSender && (isRecent || isPendingMessage)
          );
        });

        if (isDuplicate) {
          console.log("Duplicate message detected, skipping...");
          return prev;
        }

        return [...prev, newMessage];
      });
    });

    // Cleanup listener
    return () => {
      console.log(`Cleaning up listener for room ${id}`);
      channel.stopListening("SendMessageEvent");
      echo.leave(`room.${id}`);
    };
  }, [id]);

  // Load initial messages
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Auto scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle send message dengan optimistic update
  const handleSend = async (text) => {
    if (!text.trim()) return;

    const tempId = `tmp-${Date.now()}`;
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

    // Optimistic update
    setMessages((prev) => [...prev, tempMessage]);
    scrollToBottom();

    try {
      const response = await sendMessage({
        id_chat_room: parseInt(id),
        message: text,
        id_sender: userId,
        is_read: false,
      });

      // Update temp message with real data
      if (response?.data) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === tempId ? { ...response.data, pending: false } : msg
          )
        );
      }
    } catch (err) {
      console.error("❌ Gagal kirim pesan:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...msg, error: true } : msg
        )
      );
    }
  };

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
