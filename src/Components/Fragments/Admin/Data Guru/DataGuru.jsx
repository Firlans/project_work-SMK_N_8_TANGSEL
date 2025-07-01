import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axiosClient from "../../../../axiosClient";
import EditGuru from "./EditGuru";
import DetailGuru from "./DetailGuru";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import Cookies from "js-cookie";

const DataGuru = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [userPrivilege, setUserPrivilege] = useState(null);
  const [error, setError] = useState(false);

  // pagination & sort
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [sortField, setSortField] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const privilegeData = Cookies.get("userPrivilege");
    if (privilegeData) {
      try {
        setUserPrivilege(JSON.parse(privilegeData));
      } catch (error) {
        setError(true);
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const guruRes = await axiosClient.get("/guru");
      const mapelRes = await axiosClient.get("/mata-pelajaran");
      const subjectsMap = mapelRes.data.data.reduce((acc, item) => {
        acc[item.id] = item.nama_pelajaran;
        return acc;
      }, {});
      setTeachers(guruRes.data.data);
      setSubjects(subjectsMap);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isSuperAdmin = () =>
    userPrivilege?.is_superadmin && userPrivilege.is_superadmin === 1;

  const handleEdit = (guru) => {
    setSelectedGuru(guru);
    setIsEditModalOpen(true);
  };

  const handleDetail = (guru) => {
    setSelectedGuru(guru);
    setIsDetailModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await axiosClient.put(`/guru/${formData.id}`, formData);
      if (res.data.status === "success") {
        fetchData();
        setMessage({ text: "Data berhasil diupdate!", type: "success" });
        setIsEditModalOpen(false);
        setSelectedGuru(null);
      }
    } catch (error) {
      setMessage({ text: "Gagal mengupdate data!", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleDelete = async (guru) => {
    if (!window.confirm("Yakin hapus guru ini?")) return;
    try {
      await axiosClient.delete(`/guru/${guru.id}`);
      fetchData();
      setMessage({ text: "Data berhasil dihapus!", type: "success" });
    } catch (error) {
      setMessage({ text: "Gagal menghapus data!", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedSubjects = Object.entries(subjects).sort((a, b) =>
    a[1].localeCompare(b[1])
  );

  const filteredTeachers = teachers
    .filter((guru) =>
      guru.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((guru) =>
      selectedSubject === "all"
        ? true
        : guru.nama_pelajaran?.includes(subjects[selectedSubject])
    )
    .sort((a, b) => {
      const valA = a[sortField]?.toLowerCase?.() || a[sortField];
      const valB = b[sortField]?.toLowerCase?.() || b[sortField];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-all duration-300">
      {/* Notifikasi */}
      {message.text && (
        <div
          className={`mb-4 p-4 rounded transition-colors duration-300 ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-200/10 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-200/10 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          Data Guru
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Cari nama guru..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded px-3 py-2 text-sm sm:text-base w-full sm:w-auto transition-colors duration-300"
          />
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded px-3 py-2 text-sm sm:text-base w-full sm:w-auto transition-colors duration-300"
          >
            <option value="all">Semua Mapel</option>
            {sortedSubjects.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-300">
              <tr>
                <th
                  className="px-3 py-2 text-left cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  onClick={() => handleSort("nip")}
                >
                  NIP {sortField === "nip" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-3 py-2 text-left cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  onClick={() => handleSort("nama")}
                >
                  Nama Guru{" "}
                  {sortField === "nama" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-3 py-2 text-left">Mata Pelajaran</th>
                <th className="px-3 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeachers.length > 0 ? (
                paginatedTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">
                      {teacher.nip}
                    </td>
                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">
                      {teacher.nama}
                    </td>
                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">
                      {teacher.nama_pelajaran?.join(", ") || "-"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDetail(teacher)}
                          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
                          title="Lihat Detail"
                        >
                          <FaEye />
                        </button>
                        {!isSuperAdmin() && (
                          <>
                            <button
                              onClick={() => handleEdit(teacher)}
                              className="text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors duration-300"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(teacher)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-300"
                              title="Hapus"
                            >
                              <FaTrash />
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
                    colSpan={4}
                    className="text-center py-4 text-gray-500 dark:text-gray-400 italic"
                  >
                    Tidak ada data guru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded transition-colors duration-300 ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
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
