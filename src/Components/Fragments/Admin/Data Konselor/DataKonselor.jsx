import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axiosClient from "../../../../axiosClient";
import EditKonselor from "./EditKonselor";
import DetailKonselor from "../../../Layouts/DetailKonselorLayouts";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";

const DataKonselor = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const teachersResponse = await axiosClient.get("/konselor");
        setTeachers(teachersResponse.data.data);

        const subjectsResponse = await axiosClient.get("/mata-pelajaran");

        const subjectsMap = subjectsResponse.data.data.reduce(
          (acc, subject) => {
            acc[subject.id] = subject.nama_pelajaran;
            return acc;
          }
        );
        setSubjects(subjectsMap);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedTeachers = [...teachers].sort((a, b) =>
    a.nama.localeCompare(b.nama)
  );

  const filteredTeachers =
    selectedSubject === "all"
      ? sortedTeachers
      : sortedTeachers.filter(
          (teacher) => teacher.mata_pelajaran_id === parseInt(selectedSubject)
        );

  const handleEdit = (guru) => {
    setSelectedGuru(guru);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await axiosClient.put(
        `/konselor/${formData.id}`,
        formData
      );

      if (response.data.status === "success") {
        const teachersResponse = await axiosClient.get("/konselor");
        setTeachers(teachersResponse.data.data);
        setIsEditModalOpen(false);
        setSelectedGuru(null);
        setMessage({ text: "Data berhasil diupdate!", type: "success" });
      }
    } catch (error) {
      setMessage({ text: "Gagal mengupdate data!", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleDetail = (guru) => {
    setSelectedGuru(guru);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
      {/* Notification Message */}
      {message.text && (
        <div
          className={`mb-4 p-4 rounded transition-colors duration-300 ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          Data Konselor
        </h2>
      </div>

      {/* Table Container */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300">
                    Nama Konselor
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                    >
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 transition-all duration-300">
                        {teacher.nama}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleDetail(teacher)}
                            className="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                            aria-label="View details"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="p-1 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                            aria-label="Edit konselor"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-3 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
                    >
                      Tidak ada Data Konselor
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditKonselor
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGuru(null);
        }}
        guru={selectedGuru}
        subjects={subjects}
        onSubmit={handleUpdate}
      />
      <DetailKonselor
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedGuru(null);
        }}
        guru={selectedGuru}
        subjects={subjects}
      />
    </div>
  );
};

export default DataKonselor;
