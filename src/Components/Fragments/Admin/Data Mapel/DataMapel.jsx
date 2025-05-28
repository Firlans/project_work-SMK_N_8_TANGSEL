import { useEffect } from "react";
import { useState } from "react";
import axiosClient from "../../../../axiosClient";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import EditMapel from "./EditMapel";
import Cookies from "js-cookie";

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
      console.log("Response Data:", response.data); // Debug response data
      setMapel(response.data.data); // Access the data array from response
    } catch (err) {
      console.error("Error fetching mapel:", err); // Debug error
      setError("Gagal memuat data mata pelajaran");
    } finally {
      setLoading(false);
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

    fetchMapel();
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
      await axiosClient.delete(`/mata-pelajaran/${id}`);
      fetchMapel();
      console.log("Data deleted.");
    } catch (err) {
      console.log(err);
      console.error("Gagal menghapus data:", err);
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

  const getSortIcon = () => {
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (mapel.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data mata pelajaran
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Mata Pelajaran</h2>
            {/* Sembunyikan tombol Tambah untuk superadmin */}
            {!isSuperAdmin() && (
              <button
                onClick={() => {
                  setModalData(null);
                  setIsModalOpen(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FaPlus /> Tambah Mata Pelajaran
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort("id")}
                  >
                    ID {getSortIcon("id")}
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort("nama_pelajaran")}
                  >
                    Mata Pelajaran {getSortIcon("nama_pelajaran")}
                  </th>
                  {!isSuperAdmin() && (
                    <>
                      <th className="px-6 py-3">Aksi</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getSortedData().map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-center">{m.id}</td>
                    <td className="px-6 py-4">{m.nama_pelajaran}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        {/* Tombol Edit dan Delete hanya untuk non-superadmin */}
                        {!isSuperAdmin() && (
                          <>
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-1 text-yellow-500 hover:text-yellow-700 transition-colors"
                              aria-label="Edit user"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              aria-label="Delete user"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && (
            <EditMapel
              onClose={() => {
                setIsModalOpen(false);
              }}
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
