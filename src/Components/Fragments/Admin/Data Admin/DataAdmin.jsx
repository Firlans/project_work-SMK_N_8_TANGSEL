import { useState, useEffect } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
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
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const adminRes = await axiosClient.get("/admin");
        setAdmin(adminRes.data.data);
      } catch (error) {
        setError(true);
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
      const response = await axiosClient.put(`/admin/${formData.id}`, formData);

      if (response.data.status === "success") {
        const adminRes = await axiosClient.get("/admin");
        setAdmin(adminRes.data.data);
        setIsEditModalOpen(false);
        setSelectedadmin(null);
        setMessage({ text: "Data berhasil diupdate!", type: "success" });
      }
    } catch (error) {
      setMessage({ text: "Gagal mengupdate data!", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleDetail = (admin) => {
    setSelectedadmin(admin);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm transition-colors duration-300">
      {message.text && (
        <div
          className={`mb-4 p-4 rounded transition-colors duration-300 ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          Data Admin
        </h2>
        <div className="w-64" />
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full transition-all duration-300">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300">
                  Nama Admin
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {admin.length > 0 ? (
                admin.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                      {a.nama}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                      <div className="p-1 flex gap-2 justify-center">
                        <button
                          onClick={() => handleDetail(a)}
                          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(a)}
                          className="p-1 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-300 transition-colors"
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
