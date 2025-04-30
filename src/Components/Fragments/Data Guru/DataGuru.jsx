import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import axiosClient from "../../../axiosClient";
import EditGuru from "./EditGuru";
import DetailGuru from "../../Layouts/DetailGuruLayouts";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

const DataGuru = () => {
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
        const teachersResponse = await axiosClient.get("/guru");
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
      const response = await axiosClient.put(`/guru/${formData.id}`, formData);
      console.log("Response dari server:", response.data);

      if (response.data.status === "success") {
        console.log("Update berhasil!");
        const teachersResponse = await axiosClient.get("/guru");
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
        <h2 className="text-2xl font-bold text-gray-800">Data Guru</h2>
        <div className="w-64">
          <select
            className="w-full p-2 border rounded-md"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">Semua Mata Pelajaran</option>
            {sortedSubjects.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Guru
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mata Pelajaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {teacher.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subjects[teacher.mata_pelajaran_id] || "Loading..."}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleDetail(teacher)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
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
                    Tidak ada Data Guru
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Add Modal Component */}
      <EditGuru
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGuru(null);
        }}
        guru={selectedGuru}
        subjects={subjects}
        onSubmit={handleUpdate}
      />
      <DetailGuru
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

export default DataGuru;
