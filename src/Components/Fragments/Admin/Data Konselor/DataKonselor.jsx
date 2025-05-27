import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, } from "react-icons/fa";
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch teachers
        const teachersResponse = await axiosClient.get("/konselor");
        setTeachers(teachersResponse.data.data);
        console.log("Data Guru:", teachersResponse.data.data);

        // Fetch subjects
        const subjectsResponse = await axiosClient.get("/mata-pelajaran");
        // Convert array to object for easier lookup
        const subjectsMap = subjectsResponse.data.data.reduce(
          (acc, subject) => {
            acc[subject.id] = subject.nama_pelajaran;
            return acc;
          },
          {}
        );
        setSubjects(subjectsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mengurutkan data guru berdasarkan nama
  const sortedTeachers = [...teachers].sort((a, b) =>
    a.nama.localeCompare(b.nama)
  );

  // Filter teachers based on selected subject
  const filteredTeachers =
    selectedSubject === "all"
      ? sortedTeachers
      : sortedTeachers.filter(
          (teacher) => teacher.mata_pelajaran_id === parseInt(selectedSubject)
        );

  // Sort subjects by name for dropdown
  const sortedSubjects = Object.entries(subjects).sort((a, b) =>
    a[1].localeCompare(b[1])
  );

  const handleEdit = (guru) => {
    setSelectedGuru(guru);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    try {
      console.log("Memulai proses update...", formData);
      const response = await axiosClient.put(
        `/konselor/${formData.id}`,
        formData
      );
      console.log("Response dari server:", response.data);

      if (response.data.status === "success") {
        console.log("Update berhasil!");
        const teachersResponse = await axiosClient.get("/konselor");
        setTeachers(teachersResponse.data.data);
        setIsEditModalOpen(false);
        setSelectedGuru(null);
        setMessage({ text: "Data berhasil diupdate!", type: "success" });
      }
    } catch (error) {
      console.error("Error saat update:", error);
      console.error("Detail error:", error.response?.data || error.message);
      setMessage({ text: "Gagal mengupdate data!", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleDetail = (guru) => {
    setSelectedGuru(guru);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      {/* Notification Message */}
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

      {/* Header Section with Responsive Layout */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Data Konselor
        </h2>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500">
                    Nama Konselor
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {teacher.nama}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleDetail(teacher)}
                            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                            aria-label="View details"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="p-1 text-yellow-500 hover:text-yellow-700 transition-colors"
                            aria-label="Edit konselor"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Delete konselor"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-3 sm:px-6 py-4 text-center text-gray-500 text-xs sm:text-sm"
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
