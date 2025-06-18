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

  useEffect(() => {
    fetchData();
    const privilegeData = Cookies.get("userPrivilege");
    if (privilegeData) {
      try {
        setUserPrivilege(JSON.parse(privilegeData));
      } catch (err) {
        console.error("Failed to parse privilege:", err);
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
      setStudents(siswaRes.data.data);
      const kelasMap = {};
      kelasRes.data.data.forEach((k) => (kelasMap[k.id] = k));
      setKelas(kelasMap);
    } catch (err) {
      console.error("Fetch error:", err);
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Siswa</h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Cari NIS / Nama"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded-md w-full md:w-1/2"
          />

          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="border p-2 rounded-md w-full md:w-1/4"
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

      {message.text && (
        <div
          className={`p-3 mb-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th
                className="p-3 cursor-pointer"
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
                className="p-3 cursor-pointer"
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
                Nama Lengkap
              </th>
              <th className="p-3">Kelas</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((siswa) => (
                <tr key={siswa.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{siswa.nis}</td>
                  <td className="p-3">{siswa.nama_lengkap}</td>
                  <td className="p-3">
                    {kelas[siswa.id_kelas]?.nama_kelas || "-"}
                  </td>
                  <td className="p-3 flex gap-2 items-center">
                    <button
                      onClick={() => handleDetail(siswa)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEye />
                    </button>
                    {!isSuperAdmin() && (
                      <button
                        onClick={() => handleEdit(siswa)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Tidak ada data siswa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-blue-600 hover:text-white transition-colors`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal */}
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
