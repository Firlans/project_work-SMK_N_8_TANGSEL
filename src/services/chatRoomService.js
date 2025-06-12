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
