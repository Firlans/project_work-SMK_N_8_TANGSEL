const ChatRoomCard = ({ room }) => {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-yellow-600 transition">
          {room.name || "Tanpa Nama"}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            room.status === "Open"
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {room.status}
        </span>
      </div>

      <div className="text-sm text-gray-500">
        <p>
          Tipe:{" "}
          {room.is_private ? (
            <span className="text-red-500 font-medium">Private</span>
          ) : (
            <span className="text-green-600 font-medium">Public</span>
          )}
        </p>
        {room.id_siswa && (
          <p className="mt-1 text-gray-400 text-xs">
            ID Siswa: {room.id_siswa}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatRoomCard;
