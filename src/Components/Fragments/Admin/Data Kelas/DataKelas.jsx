import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import EditKelas from "./EditKelas";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";

const DataKelas = () => {
  const [loading, setLoading] = useState(true);
  const [kelas, setKelas] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPrivilege, setUserPrivilege] = useState(null);

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
    // Ambil dan parse privilege dari cookies
    const privilegeData = Cookies.get("userPrivilege");
    console.log("Cookie privilege data:", privilegeData);

    if (privilegeData) {
      try {
        const parsedPrivilege = JSON.parse(privilegeData);
        console.log("Parsed privilege:", parsedPrivilege);
        setUserPrivilege(parsedPrivilege);
      } catch (error) {
        console.error("Error parsing privilege:", error);
      }
    }
    fetchKelas();
    fetchSiswa();
  }, []);

  const isSuperAdmin = () => {
    if (!userPrivilege) {
      console.log("userPrivilege is null");
      return false;
    }
    const isSuperAdmin = userPrivilege.is_superadmin === 1;
    return isSuperAdmin;
  };

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
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 transition-all duration-300">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              Data Kelas
            </h2>

            {!isSuperAdmin() && (
              <button
                onClick={() => {
                  setModalData(null);
                  setIsModalOpen(true);
                }}
                className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2 flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
              >
                <FaPlus className="w-4 h-4" />
                <span>Tambah Kelas</span>
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Nama Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Ketua Kelas
                  </th>
                  {!isSuperAdmin() && (
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-300">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                {kelas.map((k) => (
                  <tr
                    key={k.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">
                      {k.nama_kelas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">
                      {getNamaKetua(k.ketua_kelas)}
                    </td>
                    {!isSuperAdmin() && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setModalData(k);
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                            aria-label="Edit kelas"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(k.id)}
                            className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                            aria-label="Delete kelas"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
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
