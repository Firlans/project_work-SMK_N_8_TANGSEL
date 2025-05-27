import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axiosClient from "../../../../axiosClient";
import EditSiswa from "./EditSiswa";
import DetailSiswa from "./DetailSiswa";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import Cookies from "js-cookie";

const DataSiswa = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [kelas, setKelas] = useState({});
  const [selectedKelas, setSelectedKelas] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [userPrivilege, setUserPrivilege] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch students
      const studentsResponse = await axiosClient.get("/siswa");
      setStudents(studentsResponse.data.data);
      console.log("[FetchData] Students:", studentsResponse.data.data);

      // Fetch kelas and store the full kelas objects
      const kelasResponse = await axiosClient.get("/kelas");
      const kelasMap = {};
      kelasResponse.data.data.forEach((kelas) => {
        kelasMap[kelas.id] = kelas;
      });
      setKelas(kelasMap);
      // console.log("[FetchData] Kelas Map:", kelasMap);
    } catch (error) {
      console.error("[FetchData] Error:", error);
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
    fetchData();
  }, []);

  // Fungsi untuk mengecek apakah user adalah superadmin
  const isSuperAdmin = () => {
    if (!userPrivilege) {
      console.log("userPrivilege is null");
      return false;
    }
    const isSuperAdmin = userPrivilege.is_superadmin === 1;
    return isSuperAdmin;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Sort students by name with nama_lengkap atau nis
  const sortedStudents = [...students]
    .filter(
      (student) =>
        student.nama_lengkap
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.nis.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!a || !b || !sortConfig.key) return 0;
      const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // console.log("[Sorting] Sorted Students:", sortedStudents);

  // Filter students based on selected kelas with id_kelas
  const filteredStudents =
    selectedKelas === "all"
      ? sortedStudents
      : sortedStudents.filter(
          (student) => student && student.id_kelas === parseInt(selectedKelas)
        );
  // console.log("[Filtering] Filtered Students:", filteredStudents);
  // console.log("[Filtering] Selected Kelas:", selectedKelas);

  // Sort kelas by nama_kelas
  const sortedKelas = Object.values(kelas).sort((a, b) => {
    if (!a || !b) return 0;
    return a.nama_kelas.localeCompare(b.nama_kelas);
  });
  // console.log("[Sorting] Sorted Kelas:", sortedKelas);

  const studentsPerPage = 25;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handleEdit = (siswa) => {
    console.log("[Edit] Selected Siswa:", siswa);
    setSelectedSiswa(siswa);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    console.log("[Update] Form Data:", formData);
    try {
      const response = await axiosClient.put(`/siswa/${formData.id}`, formData);
      console.log("[Update] Response:", response.data);
      if (response.data.status === "success") {
        const studentsResponse = await axiosClient.get("/siswa");
        setStudents(studentsResponse.data.data);
        setIsEditModalOpen(false);
        setSelectedSiswa(null);
        setMessage({ text: "Data berhasil diupdate!", type: "success" });
      }
    } catch (error) {
      console.error("[Update] Error:", error);
      setMessage({ text: "Gagal mengupdate data!", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleDetail = (siswa) => {
    setSelectedSiswa(siswa);
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
        <h2 className="text-2xl font-bold text-gray-800">Data Siswa</h2>
        <div className="w-64">
          <select
            className="w-full p-2 border rounded-md"
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
          >
            <option value="all">Semua Kelas</option>
            {sortedKelas.map((kelas) => (
              <option key={kelas.id} value={kelas.id}>
                {kelas.nama_kelas}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari NIS atau Nama"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded-md w-1/2"
        />
        <div>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded mr-2 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() =>
                  setSortConfig((prev) => ({
                    key: "nis",
                    direction:
                      prev.key === "nis" && prev.direction === "asc"
                        ? "desc"
                        : "asc",
                  }))
                }
              >
                NIS
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() =>
                  setSortConfig((prev) => ({
                    key: "nama_lengkap",
                    direction:
                      prev.key === "nama_lengkap" && prev.direction === "asc"
                        ? "desc"
                        : "asc",
                  }))
                }
              >
                Nama Siswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kelas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{student.nis}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.nama_lengkap}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {kelas[student.id_kelas]?.nama_kelas || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleDetail(student)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEye />
                    </button>
                    {!isSuperAdmin() && (
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-1 text-yellow-500 hover:text-yellow-700 transition-colors"
                        aria-label="Edit user"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada Data Siswa
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <EditSiswa
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSiswa(null);
        }}
        siswa={selectedSiswa}
        kelas={kelas}
        onSubmit={handleUpdate}
      />
      <DetailSiswa
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSiswa(null);
        }}
        siswa={selectedSiswa}
        kelas={kelas}
      />
    </div>
  );
};

export default DataSiswa;
