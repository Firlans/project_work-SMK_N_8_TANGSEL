import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatRoomList from "../../Fragments/ChatRoom/ChatRoomList";
import ChatRoomForm from "../../Fragments/ChatRoom/ChatRoomForm";
import ChatRoomEditForm from "../../Fragments/ChatRoom/ChatRoomEditForm";
import Cookies from "js-cookie";
import { IoChevronBackSharp } from "react-icons/io5";

const KonselingSiswaPrivate = () => {
  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get("userPrivilege") || "{}");
  const idSiswa = user?.user_id || user?.id;

  // State Create
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State Edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRoomUpdated = () => {
    setRefreshKey((prev) => prev + 1);
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

      {/* Header dan Tombol Buat Chat Room */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Daftar Chat Room Private
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow"
        >
          + Buat Chat Room
        </button>
      </div>

      {/* Daftar Chat Room */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <ChatRoomList
          role="siswa"
          idUser={idSiswa}
          isPrivate={true}
          refreshKey={refreshKey}
          onEdit={(room) => {
            setEditRoom(room);
            setShowEditModal(true);
          }}
          onDeleted={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      {/* Modal Buat */}
      <ChatRoomForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRoomCreated={() => setRefreshKey((k) => k + 1)}
        isPrivate={true}
      />

      {/* Modal Edit */}
      <ChatRoomEditForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        room={editRoom}
        onUpdated={handleRoomUpdated}
      />
    </div>
  );
};

export default KonselingSiswaPrivate;
