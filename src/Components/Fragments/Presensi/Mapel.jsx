import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

const MapelTable = ({ onSelectMapel }) => {
  const [mapel, setMapel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const response = await axiosClient.get("/mata-pelajaran");
        console.log("Response Data:", response.data); // Debug response data
        setMapel(response.data.data); // Access the data array from response
      } catch (err) {
        console.error("Error fetching mapel:", err); // Debug error
        setError("Gagal memuat data mata pelajaran");
      } finally {
        setLoading(false);
      }
    };
    fetchMapel();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (mapel.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data mata pelajaran
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left">ID</th>
            <th className="px-6 py-3 text-left">Mata Pelajaran</th>
            <th className="px-6 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mapel.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{m.id}</td>
              <td className="px-6 py-4">{m.nama_pelajaran}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelectMapel(m.id)}
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

export default MapelTable;