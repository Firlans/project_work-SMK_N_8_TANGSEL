import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";
import FormWaliMurid from "./FormWaliMurid";
import axiosClient from "../../../../axiosClient";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";

const DataWaliMurid = () => {
  const [waliList, setWaliList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nama_lengkap");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWali, setEditingWali] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPrivilege, setUserPrivilege] = useState(null);
  const [error, setError] = useState(false);

  const fetchWaliMurid = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/wali-murid");
      setWaliList(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiswa = async () => {
    const res = await axiosClient.get("/siswa");
    setSiswaList(res.data.data);
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
    fetchWaliMurid();
    fetchSiswa();
  }, []);

  const isSuperAdmin = () => userPrivilege?.is_superadmin === 1;
  const isAdminOnly = () =>
    userPrivilege?.is_admin === 1 && userPrivilege?.is_superadmin !== 1;

  const handleDelete = async (id) => {
    if (!isAdminOnly()) return;
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    await axiosClient.delete(`/wali-murid/${id}`);
    fetchWaliMurid();
  };

  const getNamaSiswa = (idSiswa) => {
    const siswa = siswaList.find((s) => s.id === idSiswa);
    return siswa ? siswa.nama_lengkap : "-";
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredData = waliList
    .filter(
      (item) =>
        item.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getNamaSiswa(item.id_siswa)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aField = a[sortBy]?.toString().toLowerCase() || "";
      const bField = b[sortBy]?.toString().toLowerCase() || "";

      if (sortOrder === "asc") return aField > bField ? 1 : -1;
      return aField < bField ? 1 : -1;
    });

  const totalPage = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    fetchWaliMurid();
    fetchSiswa();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-all duration-300">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Data Wali Murid
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Cari Nama Wali atau Siswa"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-100 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-all duration-300"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {isAdminOnly() && (
                <button
                  onClick={() => {
                    setEditingWali(null);
                    setModalOpen(true);
                  }}
                  className="
                  bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2  flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Tambah Wali Murid</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}

          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      No.
                    </th>
                    <th
                      className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors cursor-pointer select-none"
                      onClick={() => handleSort("nama_lengkap")}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {" "}
                        {/* Mengatur teks dan ikon di tengah */}
                        Nama Wali
                        {sortBy === "nama_lengkap" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      Nama Siswa
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      No Telp
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      Email
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      Alamat
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs sm:text-sm divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((wali, index) => (
                      <tr
                        key={wali.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                      >
                        <td className="px-3 sm:px-6 py-2 sm:py-4 text-center whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {(currentPage - 1) * perPage + index + 1}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300 font-medium">
                          {wali.nama_lengkap}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {getNamaSiswa(wali.id_siswa)}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 capitalize whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {wali.status}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {wali.no_telp}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {wali.email}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                          {wali.alamat}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            {isAdminOnly() && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingWali(wali);
                                    setModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors duration-300"
                                  title="Edit Wali"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(wali.id)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-300"
                                  title="Hapus Wali"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400 italic transition-colors duration-300"
                      >
                        Tidak ada data Orang Tua/Wali Murid yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPage > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: totalPage }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}

          {/* Modal */}
          {modalOpen && (
            <FormWaliMurid
              siswaList={siswaList}
              defaultData={editingWali}
              onClose={() => {
                setModalOpen(false);
                setEditingWali(null);
                fetchWaliMurid();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DataWaliMurid;
