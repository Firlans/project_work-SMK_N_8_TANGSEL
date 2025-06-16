import axiosClient from "../axiosClient";

export const fetchChatRoomsByConselor = async (id) => {
  const res = await axiosClient.get(`/chat-room/conselor/${id}`);
  return res.data.data;
};

export const fetchChatRoomsBySiswa = async (idSiswa) => {
  const res = await axiosClient.get(`/chat-room/siswa/${idSiswa}`);
  return res.data.data;
};

export const fetchChatRoomByAccessCode = async (accessCode) => {
  const res = await axiosClient.get(`/chat-room/access-code/${accessCode}`);
  console.log("Response dari access code:", res.data);
  return res.data;
};

export const fetchAllConselors = async () => {
  const res = await axiosClient.get("/konselor");
  return res.data;
};

export const fetchAllStudents = async () => {
  const res = await axiosClient.get("/siswa");
  return res.data.data;
}

export const getChatRoomById = async (id) => {
  const res = await axiosClient.get(`/chat-room/${id}`);
  return res.data;
};

export const fetchLastMessage = async (roomId) => {
  try {
    const res = await axiosClient.get(`/chat/room/${roomId}?page=1`);

    // Optional: cek struktur datanya
    if (
      res?.data?.data?.data &&
      Array.isArray(res.data.data.data) &&
      res.data.data.data.length > 0
    ) {
      return res.data.data.data[0]; // Ambil pesan terakhir (halaman 1, indeks 0)
    }

    return null;
  } catch (error) {
    console.error(`Gagal ambil last message untuk room ${roomId}`, error);
    return null;
  }
};

export const createChatRoom = async (roomData) => {
  try {
    const res = await axiosClient.post("/chat-room", roomData);
    return res.data;
  } catch (error) {
    throw new Error("Failed to create chat room");
  }
};

export const updateChatRoom = async (id, roomData) => {
  try {
    const res = await axiosClient.put(`/chat-room/${id}`, roomData);
    return res.data;
  } catch (error) {
    throw new Error("Failed to update chat room");
  }
};

export const deleteChatRoom = async (id) => {
  try {
    const res = await axiosClient.delete(`/chat-room/${id}`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to delete chat room");
  }
};

export const getChatMessages = async (roomId) => {
  const res = await axiosClient.get(`/chat/room/${roomId}`);
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await axiosClient.post("/chat/send", data);
  return res.data;
};
