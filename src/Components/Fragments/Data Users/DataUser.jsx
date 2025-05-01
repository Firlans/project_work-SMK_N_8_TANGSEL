import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axiosClient from "../../../axiosClient";
import CreateEditUser from "./CreateEditUser";
import DetailUser from "./DetailUser";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

const DataUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRole, setSelectedRole] = useState("all");

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
    fetchUsers();
  }, []);

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
      : users.filter((user) => user.role === selectedRole);

  // Sederhanakan pengurutan hanya ascending
  const sortedUsers = [...filteredUsers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  console.log("Sorted and filtered users:", sortedUsers);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Data Guru</h2>
            <button
              onClick={handleCreate}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaPlus /> Add New User
            </button>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="konselor">Konselor</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 border-b">Nama Lengkap</th>
                  <th className="px-6 py-3 border-b">Role</th>
                  <th className="px-6 py-3 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{user.name}</td>
                    <td className="px-6 py-4 border-b capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDetail(user)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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

          {showModal && (
            <CreateEditUser
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
