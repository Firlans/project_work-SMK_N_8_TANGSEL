import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, } from "react-icons/fa";
import axiosClient from "../../../../axiosClient";
import EditSiswa from "./EditSiswa";
import DetailSiswa from "../../../Layouts/DetailSiswaLayouts";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";

const DataSiswa = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [kelas, setKelas] = useState({});
  const [selectedKelas, setSelectedKelas] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
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
        console.log("[FetchData] Kelas Map:", kelasMap);
      } catch (error) {
        console.error("[FetchData] Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Sort students by name with nama_lengkap
  const sortedStudents = [...students].sort((a, b) => {
    if (!a || !b) return 0;
    return a.nama_lengkap.localeCompare(b.nama_lengkap);
  });
  console.log("[Sorting] Sorted Students:", sortedStudents);

  // Filter students based on selected kelas with id_kelas
  const filteredStudents =
    selectedKelas === "all"
      ? sortedStudents
      : sortedStudents.filter(
          (student) => student && student.id_kelas === parseInt(selectedKelas)
        );
  console.log("[Filtering] Filtered Students:", filteredStudents);
  console.log("[Filtering] Selected Kelas:", selectedKelas);

  // Sort kelas by nama_kelas
  const sortedKelas = Object.values(kelas).sort((a, b) => {
    if (!a || !b) return 0;
    return a.nama_kelas.localeCompare(b.nama_kelas);
  });
  console.log("[Sorting] Sorted Kelas:", sortedKelas);

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
    console.log("[Detail] Selected Siswa:", siswa);
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
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
