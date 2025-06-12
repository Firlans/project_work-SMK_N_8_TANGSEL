const ChatMessage = ({ message, userId }) => {
  const isMine = message.id_sender === userId;

  return (
    <div className={`my-2 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`px-4 py-2 rounded-lg ${isMine ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
        {message.message}
      </div>
    </div>
  );
};

export default ChatMessage;
