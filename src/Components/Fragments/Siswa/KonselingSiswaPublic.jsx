import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";
import ChatRoomList from "../ChatRoom/ChatRoomList";
import ChatRoomForm from "../ChatRoom/ChatRoomForm";
import ChatRoomEditForm from "../ChatRoom/ChatRoomEditForm";
import { IoChevronBackSharp } from "react-icons/io5";

const KonselingSiswaPublic = () => {
  const navigate = useNavigate();
  const idSiswa = JSON.parse(Cookies.get("user_id") || "{}");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRoomUpdated = () => {
    setRefreshKey((prev) => prev + 1);
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

      {/* Header & Create Room Button */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 transition-colors">
          Daftar Chat Room Public
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg font-medium shadow bg-amber-500 dark:bg-slate-600 text-white hover:bg-amber-600 dark:hover:bg-slate-700 transition-all duration-300"
        >
          + Buat Chat Room
        </button>
      </div>

      {/* Chat Room List */}
      <div className="rounded-xl p-6">
        <ChatRoomList
          role="siswa"
          idUser={idSiswa}
          isPrivate={false}
          refreshKey={refreshKey}
          onEdit={(room) => {
            setEditRoom(room);
            setShowEditModal(true);
          }}
          onDeleted={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      {/* Modal Tambah */}
      <ChatRoomForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRoomCreated={() => setRefreshKey((k) => k + 1)}
        isPrivate={false}
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

export default KonselingSiswaPublic;
