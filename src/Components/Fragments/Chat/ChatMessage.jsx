const ChatMessage = ({ message, userId, isPending, hasError }) => {
  const isSender = message.id_sender === userId;

  return (
    <div className={`my-2 flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2.5 max-w-[75%] shadow-sm
          ${
            isSender
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm"
              : "bg-white text-gray-700 rounded-2xl rounded-tl-sm border border-gray-100"
          }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.message}
        </p>

        <span
          className={`text-xs mt-1 block ${
            isSender ? "text-blue-100" : "text-gray-400"
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {hasError && (
          <p className="text-red-500 text-xs mt-1 italic">Gagal terkirim</p>
        )}
        {isPending && (
          <p className="text-gray-300 text-xs mt-1 italic">Mengirim...</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
