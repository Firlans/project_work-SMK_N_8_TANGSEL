import React, { useEffect } from "react";
import echo from "../echo";

const ChatRoom = ({ roomId }) => {

  useEffect(() => {
    const channel = echo.private(`room.9`);
    console.log(`connecting to room.9...`)
    channel.listen('SendMessageEvent', (e) => {
      console.log("Pesan baru diterima:", e.message);
      console.log("Dari:", e.sender);
      // Lakukan sesuatu, seperti update state chat
    });

    // Cleanup saat komponen unmount
    return () => {
      echo.leave(`room.9`);
    };
  }, [roomId]);

  return (
    <div>
      <h2>Chat Room {roomId}</h2>
    </div>
  );
};

export default ChatRoom;
