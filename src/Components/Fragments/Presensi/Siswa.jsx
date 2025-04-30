import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

const SiswaTable = ({ kelasId, onSelectSiswa }) => {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await axiosClient.get("/siswa");
        const filteredSiswa = response.data.data.filter(
          (s) => s.id_kelas === kelasId
        );
        setSiswa(filteredSiswa);
      } catch (err) {
        console.error("Error fetching siswa:", err);
        setError("Gagal memuat data siswa");
      } finally {
        setLoading(false);
      }
    };
    fetchSiswa();
  }, [kelasId]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return siswa;

    return [...siswa].sort((a, b) => {
      if (sortConfig.key === "nis") {
        return sortConfig.direction === "ascending"
          ? a.nis.localeCompare(b.nis)
          : b.nis.localeCompare(a.nis);
      }

      if (sortConfig.key === "nama_lengkap") {
        return sortConfig.direction === "ascending"
          ? a.nama_lengkap.localeCompare(b.nama_lengkap)
          : b.nama_lengkap.localeCompare(a.nama_lengkap);
      }
      return 0;
    });
  };

  const getSortIcon = () => {
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (siswa.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data siswa di kelas ini
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="px-6 py-3 text-left cursor-pointer hover:bg-gray-200"
              onClick={() => requestSort("nis")}
            >
              NIS {getSortIcon("nis")}
            </th>
            <th
              className="px-6 py-3 text-left cursor-pointer hover:bg-gray-200"
              onClick={() => requestSort("nama_lengkap")}
            >
              Nama Siswa {getSortIcon("nama_lengkap")}
            </th>
            <th className="px-6 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {getSortedData().map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{s.nis}</td>
              <td className="px-6 py-4">{s.nama_lengkap}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelectSiswa(s.id)}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Pilih
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SiswaTable;
