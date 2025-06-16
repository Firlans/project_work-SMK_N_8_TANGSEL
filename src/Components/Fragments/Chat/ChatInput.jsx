import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md">
      <div className="w-full">
        <div className="relative flex items-center gap-2">
          <input
            className="w-full bg-gray-50 rounded-lg px-4 py-3 pr-12 
                     border border-gray-200 focus:ring-2 focus:ring-blue-400 
                     placeholder:text-gray-400 text-gray-600
                     transition-all duration-200"
            placeholder="Ketik pesan anda..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="absolute right-2 p-2 rounded-lg bg-blue-500 
                     hover:bg-blue-600 text-white transition-all 
                     duration-200 active:scale-95 disabled:opacity-50
                     disabled:cursor-not-allowed"
            disabled={!text.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;