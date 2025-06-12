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
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <IoChevronBackSharp size={18} />
          <span>Kembali</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Daftar Chat Room Publik
      </h1>

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

      {/* Modal Edit Chat Room */}
      <ChatRoomEditForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        room={editRoom}
        onUpdated={handleRoomUpdated}
      />
    </div>
  );
};

export default KonselingPublic;
