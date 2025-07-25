import { useEffect } from "react";
import { useState } from "react";
import axiosClient from "../../../../axiosClient";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import EditMapel from "./EditMapel";
import Cookies from "js-cookie";
import { capitalizeEachWord } from "../../../../utils/capitalizeEachWord";

const DataMapel = () => {
  const [mapel, setMapel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPrivilege, setUserPrivilege] = useState(null);

  const fetchMapel = async () => {
    try {
      const response = await axiosClient.get("/mata-pelajaran");
      setMapel(
        response.data.data.sort((a, b) =>
          a.nama_pelajaran.localeCompare(b.nama_pelajaran)
        )
      );
    } catch (err) {
      setError("Gagal memuat data mata pelajaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const privilegeData = Cookies.get("userPrivilege");

    if (privilegeData) {
      try {
        const parsedPrivilege = JSON.parse(privilegeData);
        setUserPrivilege(parsedPrivilege);
      } catch (error) {
        setError(true);
      }
    }

    fetchMapel();
  }, []);

  const isSuperAdmin = () => {
    if (!userPrivilege) {
      return false;
    }
    const isSuperAdmin = userPrivilege.is_superadmin === 1;
    return isSuperAdmin;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus mata pelajaran ini?")) return;
    try {
      await axiosClient.delete(`/mata-pelajaran/${id}`);
      fetchMapel();
    } catch (err) {
      setError(true);
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return mapel;

    return [...mapel].sort((a, b) => {
      if (sortConfig.key === "id") {
        return sortConfig.direction === "ascending" ? a.id - b.id : b.id - a.id;
      }

      if (sortConfig.key === "nama_pelajaran") {
        return sortConfig.direction === "ascending"
          ? a.nama_pelajaran.localeCompare(b.nama_pelajaran)
          : b.nama_pelajaran.localeCompare(a.nama_pelajaran);
      }
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  if (loading) return <LoadingSpinner text={"Memuat data mata pelajaran..."} />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 transition-all duration-300">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white transition-colors">
              Mata Pelajaran
            </h2>
            {!isSuperAdmin() && (
              <button
                onClick={() => {
                  setModalData(null);
                  setIsModalOpen(true);
                }}
                className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2  flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
              >
                <FaPlus className="w-4 h-4" />
                Tambah Mata Pelajaran
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 rounded-lg overflow-hidden transition-colors duration-300">
              <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <tr>
                  <th className="px-6 py-3 text-center font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    No.
                  </th>
                  <th
                    className="px-6 py-3 text-center font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => requestSort("nama_pelajaran")}
                  >
                    Mata Pelajaran {getSortIcon("nama_pelajaran")}
                  </th>
                  {!isSuperAdmin() && (
                    <th className="px-6 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                {getSortedData().length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                    >
                      Tidak ada data mata pelajaran.
                    </td>
                  </tr>
                ) : (
                  getSortedData().map((m, idx) => (
                    <tr
                      key={m.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-white text-center">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-white">
                        {capitalizeEachWord(m.nama_pelajaran)}
                      </td>
                      {!isSuperAdmin() && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => {
                                setModalData(m);
                                setIsModalOpen(true);
                              }}
                              className="p-1 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                              aria-label="Edit mapel"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(m.id)}
                              className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                              aria-label="Hapus mapel"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <EditMapel
              onClose={() => setIsModalOpen(false)}
              initialData={modalData}
              refreshData={fetchMapel}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DataMapel;
