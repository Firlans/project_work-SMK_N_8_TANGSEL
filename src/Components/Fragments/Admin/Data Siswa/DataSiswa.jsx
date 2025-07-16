import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axiosClient from "../../../../axiosClient";
import EditSiswa from "./EditSiswa";
import DetailSiswa from "./DetailSiswa";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import Cookies from "js-cookie";

const DataSiswa = () => {
  const [students, setStudents] = useState([]);
  const [kelas, setKelas] = useState({});
  const [selectedKelas, setSelectedKelas] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [userPrivilege, setUserPrivilege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
    const privilegeData = Cookies.get("userPrivilege");
    if (privilegeData) {
      try {
        setUserPrivilege(JSON.parse(privilegeData));
      } catch (err) {
        setError(true);
      }
    }
  }, []);

  const isSuperAdmin = () => userPrivilege?.is_superadmin === 1;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [siswaRes, kelasRes] = await Promise.all([
        axiosClient.get("/siswa"),
        axiosClient.get("/kelas"),
      ]);
      setStudents(siswaRes.data.data.sort((a, b) => a.nis - b.nis));
      const kelasMap = {};
      kelasRes.data.data.forEach((k) => (kelasMap[k.id] = k));
      setKelas(kelasMap);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (siswa) => {
    setSelectedSiswa(siswa);
    setIsEditModalOpen(true);
  };

  const handleDetail = (siswa) => {
    setSelectedSiswa(siswa);
    setIsDetailModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await axiosClient.put(`/siswa/${formData.id}`, formData);
      if (res.data.status === "success") {
        await fetchData();
        setIsEditModalOpen(false);
        setMessage({ text: "Data berhasil diperbarui!", type: "success" });
      }
    } catch (err) {
      setMessage({ text: "Gagal memperbarui data.", type: "error" });
    }
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // Filter & sort
  const filtered = students
    .filter(
      (s) =>
        s.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (s) => selectedKelas === "all" || s.id_kelas === parseInt(selectedKelas)
    );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toString().toLowerCase() ?? "";
    const bVal = b[sortConfig.key]?.toString().toLowerCase() ?? "";
    return sortConfig.direction === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const itemsPerPage = 20;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <LoadingSpinner text={"Memuat data siswa..."} />;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-md transition-colors duration-300">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
          Data Siswa
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Cari NIS / Nama"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded-md w-full md:w-1/2 transition-all duration-300"
          />

          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-2 rounded-md w-full md:w-1/4 transition-all duration-300"
          >
            <option value="all">Semua Kelas</option>
            {Object.values(kelas)
              .sort((a, b) => a.nama_kelas.localeCompare(b.nama_kelas))
              .map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kelas}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-3 mb-4 rounded-md transition-all duration-300 ${
            message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Table */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
            <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
              <tr>
                <th
                  className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors cursor-pointer select-none"
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
                  NIS{" "}
                  {sortConfig.key === "nis" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors cursor-pointer select-none"
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
                  Nama Lengkap{" "}
                  {sortConfig.key === "nama_lengkap" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                  Kelas
                </th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y  text-xs sm:text-sm divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
              {paginated.length > 0 ? (
                paginated.map((siswa) => (
                  <tr
                    key={siswa.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                      {siswa.nis}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                      {siswa.nama_lengkap}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-800 dark:text-gray-100 transition-colors duration-300">
                      {kelas[siswa.id_kelas]?.nama_kelas || "-"}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDetail(siswa)}
                          className="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
                          aria-label="View details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        {!isSuperAdmin() && ( // Menampilkan tombol edit jika bukan SuperAdmin
                          <button
                            onClick={() => handleEdit(siswa)}
                            className="p-1 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors duration-300"
                            aria-label="Edit user"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400 italic transition-colors duration-300"
                  >
                    Tidak ada data siswa yang ditemukan.
                  </td>
                </tr>
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
            const active = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded transition-colors duration-300 ${
                  active
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}

      {/* Modals */}
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
