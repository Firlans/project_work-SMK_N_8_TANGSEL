import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getChatMessages,
  sendMessage,
} from "../../../services/chatRoomService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import echo from "../../../utils/echo";
import Cookies from "js-cookie";

const ChatRoomDetail = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const user = JSON.parse(Cookies.get("userPrivilege") || "{}");

  useEffect(() => {
    if (!id) return;

    getChatMessages(id, page).then((res) => {
      const allMessages = res.data.data;

      // Filter hanya untuk chat room saat ini
      const filtered = allMessages.filter(
        (msg) => msg.id_chat_room === parseInt(id)
      );

      setMessages(filtered);
    });

    const channel = echo.private(`room.${id}`);
    channel.listen("SendMessageEvent", (e) => {
      if (e.message.id_chat_room === parseInt(id)) {
        setMessages((prev) => [...prev, e.message]);
      }
    });

    return () => {
      echo.leave(`room.${id}`);
    };
  }, [id, page]);

  const handleSend = async (text) => {
    try {
      await sendMessage({
        id_chat_room: parseInt(id),
        message: text,
        id_sender: user?.user_id || user?.id,
        is_read: false,
      });
    } catch (err) {
      console.error("Gagal kirim pesan:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Chat Room #{id}</h2>

      <div className="h-80 overflow-y-scroll border p-4 rounded bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500">Belum ada pesan.</p>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              userId={user?.user_id || user?.id}
            />
          ))
        )}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatRoomDetail;
