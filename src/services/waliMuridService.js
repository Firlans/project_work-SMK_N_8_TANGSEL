import axiosClient from "../axiosClient";

export const getWaliMuridBySiswaId = async (idSiswa) => {
  try {
    const response = await axiosClient.get("/wali-murid");

    const allWaliMurid = response.data?.data || [];

    const filteredWaliMurid = allWaliMurid.filter(
      (wali) => wali.id_siswa === idSiswa
    );

    return filteredWaliMurid[0] || null;
  } catch (error) {
    console.error(
      `Error fetching wali murid for siswa ID ${idSiswa}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
