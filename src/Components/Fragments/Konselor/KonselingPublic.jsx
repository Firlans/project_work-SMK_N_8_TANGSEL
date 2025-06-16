import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import ChatRoomList from "../ChatRoom/ChatRoomList";
import ChatRoomEditForm from "../ChatRoom/ChatRoomEditForm";

const KonselingPublic = () => {
  const navigate = useNavigate();
  const privilege = JSON.parse(Cookies.get("userPrivilege") || "{}");
  const idConselor = privilege?.user_id || privilege?.id;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRoomUpdated = () => {
    setRefreshKey((k) => k + 1);
    setShowEditModal(false);
    setEditRoom(null);
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-blue-700 transition"
        >
          <IoChevronBackSharp size={18} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Daftar Chat Room Publik
      </h1>

      {/* List */}
      <div className="bg-white shadow-lg rounded-xl p-6">
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
