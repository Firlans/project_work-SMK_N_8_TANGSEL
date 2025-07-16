import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import ChatRoomList from "../ChatRoom/ChatRoomList";
import ChatRoomEditForm from "../ChatRoom/ChatRoomEditForm";

const KonselingPublic = () => {
  const navigate = useNavigate();
  const idConselor = JSON.parse(Cookies.get("user_id") || "{}");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRoomUpdated = () => {
    setRefreshKey((k) => k + 1);
    setShowEditModal(false);
    setEditRoom(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 transition-colors duration-300">
      {/* Back Button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm bg-amber-500 dark:bg-slate-600 text-white hover:bg-amber-600 dark:hover:bg-slate-700 transition-all duration-300"
        >
          <IoChevronBackSharp size={18} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 transition-colors">
        Daftar Chat Room Public
      </h1>

      {/* List */}
      <div className="rounded-xl p-6">
        <ChatRoomList
          role="conselor"
          idUser={idConselor}
          isPrivate={false}
          refreshKey={refreshKey}
          onEdit={(room) => {
            setEditRoom(room);
            setShowEditModal(true);
          }}
          onDeleted={() => setRefreshKey((k) => k + 1)}
        />

        {/* Modal */}
        <ChatRoomEditForm
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          room={editRoom}
          onUpdated={handleRoomUpdated}
        />
      </div>
    </div>
  );
};

export default KonselingPublic;
