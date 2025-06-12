import axiosClient from "../axiosClient";

export const fetchChatRoomsByConselor = async (id) => {
  const res = await axiosClient.get(`/chat-room/conselor/${id}`);
  return res.data.data;
};

export const fetchChatRoomsBySiswa = async (idSiswa) => {
  const res = await axiosClient.get(`/chat-room/siswa/${idSiswa}`);
  return res.data.data;
};

export const fetchAllConselors = async () => {
  const res = await axiosClient.get("/konselor");
  return res.data;
};

export const createChatRoom = async (roomData) => {
  try {
    const res = await axiosClient.post("/chat-room", roomData); // <--- INI SUDAH BENAR
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
}

export const getChatMessages = async (roomId) => {
  const res = await axiosClient.get(`/chat/room/${roomId}`);
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await axiosClient.post("/chat/send", data);
  return res.data;
};
