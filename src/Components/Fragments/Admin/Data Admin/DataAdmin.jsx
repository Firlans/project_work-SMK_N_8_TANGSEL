import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axiosClient from "../../../../axiosClient";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import EditAdmin from "./EditAdmin";
import DetailAdmin from "../../../Layouts/DetailAdminLayouts";

const DataAdmin = () => {
  const [admin, setAdmin] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedadmin, setSelectedadmin] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const adminRes = await axiosClient.get("/admin");
        setAdmin(adminRes.data.data);
        console.log("Data Admin:", adminRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (admin) => {
    setSelectedadmin(admin);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    try {
      console.log("Memulai proses update...", formData);
      const response = await axiosClient.put(
        `/admin/${formData.id}`,
        formData
      );
      console.log("Response dari server:", response.data);

      if (response.data.status === "success") {
        console.log("Update berhasil!");
        const adminRes = await axiosClient.get("/admin");
        setAdmin(adminRes.data.data);
        setIsEditModalOpen(false);
        setSelectedadmin(null);
        setMessage({ text: "Data berhasil diupdate!", type: "success" });
      }
    } catch (error) {
      console.error("Error saat update:", error);
      console.error("Detail error:", error.response?.data || error.message);
      setMessage({ text: "Gagal mengupdate data!", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleDetail = (admin) => {
    setSelectedadmin(admin);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {message.text && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Data Admin</h2>
        <div className="w-64"></div>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Konselor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admin.length > 0 ? (
                admin.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleDetail(a)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(a)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada Data Admin
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Add Modal Component */}
      <EditAdmin
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedadmin(null);
        }}
        admin={selectedadmin}
        onSubmit={handleUpdate}
      />
      <DetailAdmin
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedadmin(null);
        }}
        admin={selectedadmin}
      />
    </div>
  );
};

export default DataAdmin;
