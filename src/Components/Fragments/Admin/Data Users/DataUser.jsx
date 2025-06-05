import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axiosClient from "../../../../axiosClient";
import DetailUser from "./DetailUser";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import Cookies from "js-cookie";
import FormUser from "./FormUser";

const DataUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRole, setSelectedRole] = useState("all");
  const [userPrivilege, setUserPrivilege] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("/user");
      console.log("Fetched users:", response.data.data);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
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

    // Panggil fetchUsers
    fetchUsers();
  }, []);

  // Fungsi untuk mengecek apakah user adalah superadmin
  const isAdmin = () => {
    if (!userPrivilege) {
      console.log("userPrivilege is null");
      return false;
    }
    const isAdmin = userPrivilege.is_admin === 1;
    return isAdmin;
  };

  const handleCreate = () => {
    console.log("Creating new user");
    setSelectedUser(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEdit = (user) => {
    console.log("Editing user:", user);
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
        console.log("Deleting user with ID:", id);
        await axiosClient.delete(`/user/${id}`);
        console.log("User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const filteredUsers =
    selectedRole === "all"
      ? users
      : users.filter((user) => user.profile === selectedRole);

  // Sederhanakan pengurutan hanya ascending
  const sortedUsers = [...filteredUsers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  console.log("Sorted and filtered users:", sortedUsers);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header Section with Responsive Layout */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Data User
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border rounded px-3 py-2 text-sm sm:text-base w-full sm:w-auto"
              >
                <option value="all">Semua Profile</option>
                {/* <option value="admin">Admin</option> */}
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
                {/* <option value="konselor">Konselor</option> */}
              </select>
              {/* Sembunyikan tombol Tambah untuk superadmin */}
              {!isAdmin() && (
                <button
                  onClick={handleCreate}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors w-full sm:w-auto"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Tambah User</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container with Horizontal Scroll */}
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500">
                      Nama Lengkap
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500">
                      Profile
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {user.name}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 capitalize whitespace-nowrap text-xs sm:text-sm">
                        {user.profile}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          {/* Tombol View selalu ditampilkan */}
                          <button
                            onClick={() => handleDetail(user)}
                            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                            aria-label="View details"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>

                          {/* Tombol Edit dan Delete hanya untuk non-superadmin */}
                          {!isAdmin() && (
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
          </div>

          {/* Modals remain unchanged */}
          {showModal && (
            <FormUser
              mode={modalMode}
              user={selectedUser}
              onClose={() => setShowModal(false)}
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
