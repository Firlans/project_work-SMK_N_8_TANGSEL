import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

const KelasTable = ({ onSelectKelas }) => {
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axiosClient.get("/kelas");
        console.log("Response Data:", response.data); // Debug response data
        setKelas(response.data.data);
      } catch (err) {
        console.error("Error fetching kelas:", err); // Debug error
        setError("Gagal memuat data kelas");
      } finally {
        setLoading(false);
      }
    };
    fetchKelas();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left">Nama Kelas</th>
            <th className="px-6 py-3 text-left">Tingkat</th>
            <th className="px-6 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kelas.map((k) => (
            <tr key={k.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{k.nama_kelas}</td>
              <td className="px-6 py-4">{k.tingkat}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelectKelas(k.id)}
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

export default KelasTable;
