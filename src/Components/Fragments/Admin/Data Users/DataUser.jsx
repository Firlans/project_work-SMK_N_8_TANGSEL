import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axiosClient from "../../../../axiosClient";
import DetailUser from "./DetailUser";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import Cookies from "js-cookie";
import FormUser from "./Form User";
import ModalBulkUploader from "./Form User/BulkUserUploader";

const ITEMS_PER_PAGE = 20;

const DataUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [userPrivilege, setUserPrivilege] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("/user");
      setUsers(response.data.data);
    } catch (error) {
      setError(true);
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
    fetchUsers();
  }, []);

  const isSuperAdmin = () => userPrivilege?.is_superadmin === 1;
  const isAdminOnly = () =>
    userPrivilege?.is_admin === 1 && userPrivilege?.is_superadmin !== 1;

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosClient.delete(`/user/${id}`);
        fetchUsers();
      } catch (error) {
        setError(true);
      }
    }
  };

  const filteredUsers = users
    .filter((user) =>
      selectedRole === "all" ? true : user.profile === selectedRole
    )
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset ke page 1 pas nyari
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6 transition-all duration-300">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              Data User
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Cari Nama User"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2 text-sm sm:text-base w-full sm:w-auto transition-all duration-300"
              />

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded px-3 py-2 text-sm sm:text-base w-full sm:w-auto transition-all duration-300"
              >
                <option value="all">Semua Profile</option>
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
              </select>

              {isSuperAdmin() && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCreate}
                    className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2 flex items-center justify-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                    Tambah User
                  </button>

                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="bg-green-600 dark:bg-slate-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-slate-700 px-4 py-2 flex items-center justify-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                    Upload Massal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      No
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      Nama Lengkap
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      Profile
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors"
                      >
                        Tidak ada data yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, idx) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-3 sm:px-6 py-2 sm:py-4 text-center whitespace-nowrap text-xs sm:text-sm text-gray-800 dark:text-gray-100 transition-colors">
                          {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800 dark:text-gray-100 transition-colors">
                          {user.name}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 capitalize whitespace-nowrap text-xs sm:text-sm text-gray-800 dark:text-gray-100 transition-colors">
                          {user.profile}
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleDetail(user)}
                              className="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                              aria-label="View details"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>

                            {isAdminOnly() && (
                              <>
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="p-1 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                                  aria-label="Edit user"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                  aria-label="Delete user"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded transition-colors duration-300 ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}

          {/* Modals */}
          {showModal && (
            <FormUser
              mode={modalMode}
              user={selectedUser}
              onClose={() => setShowModal(false)}
              onSuccess={fetchUsers}
            />
          )}

          {showBulkModal && (
            <ModalBulkUploader
              onClose={() => setShowBulkModal(false)}
              onSuccess={fetchUsers}
            />
          )}

          {showDetailModal && (
            <DetailUser
              user={selectedUser}
              onClose={() => setShowDetailModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DataUser;
