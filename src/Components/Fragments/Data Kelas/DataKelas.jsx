import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import EditKelas from "./EditKelas";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import React from "react";

const DataKelas = () => {
  const [loading, setLoading] = useState(true);
  const [kelas, setKelas] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchKelas = async () => {
    try {
      const res = await axiosClient.get("/kelas");
      const sortedKelas = res.data.data.sort((a, b) =>
        a.nama_kelas.localeCompare(b.nama_kelas)
      );
      setKelas(sortedKelas);
      console.log("Data kelas:", res.data.data);
    } catch (err) {
      console.error("Gagal mengambil data kelas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiswa = async () => {
    try {
      const res = await axiosClient.get("/siswa");
      const sortedSiswa = res.data.data.sort((a, b) =>
        a.nama_lengkap.localeCompare(b.nama_lengkap)
      );
      setSiswaList(sortedSiswa);
    } catch (err) {
      console.error("Gagal mengambil data siswa:", err);
    }
  };

  useEffect(() => {
    fetchKelas();
    fetchSiswa();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kelas ini?")) return;
    try {
      await axiosClient.delete(`/kelas/${id}`);
      fetchKelas();
      console.log("Kelas berhasil dihapus");
    } catch (err) {
      console.log(err);
      console.error("Gagal menghapus data:", err);
    }
  };

  const getNamaKetua = (id) =>
    siswaList.find((s) => s.id === id)?.nama_lengkap || "-";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Data Kelas</h2>
            <button
              onClick={() => {
                setModalData(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaPlus /> Tambah Kelas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3">Nama Kelas</th>
                  <th className="px-6 py-3">Ketua Kelas</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kelas.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {k.nama_kelas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getNamaKetua(k.ketua_kelas)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setModalData(k);
                            setIsModalOpen(true);
                          }}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(k.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isModalOpen && (
            <EditKelas
              onClose={() => setIsModalOpen(false)}
              refreshData={fetchKelas}
              initialData={modalData}
              siswaList={siswaList}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DataKelas;
