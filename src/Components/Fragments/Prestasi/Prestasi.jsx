import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Badge from "../../Elements/Badges/Index";
import ModalPrestasi from "./FormPrestasi";

const Prestasi = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axiosClient.get("/prestasi");
      console.log("Data Prestasi:", res.data.data);
      const pelanggaranWithNama = await Promise.all(
        res.data.data.map(async (item) => {
          const siswa = await axiosClient.get(`/siswa/${item.siswa_id}`);
          return {
            ...item,
            nama_siswa_id: siswa.data.data.nama_lengkap,
          };
        })
      );
      setData(pelanggaranWithNama);
    } catch (err) {
      console.error("Gagal mengambil pelanggaran:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axiosClient.delete(`/prestasi/${id}`);
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header Section with Responsive Layout */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Daftar Prestasi
            </h2>
            <button
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              onClick={() => {
                setSelected(null);
                setShowModal(true);
              }}
            >
              <FaPlus className="w-4 h-4" /> Tambah Prestasi
            </button>
          </div>

          {/* Table Container with Horizontal Scroll */}
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                      No
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                      Nama Siswa
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                      Foto
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                      Deskripsi
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {index + 1}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        {item.nama_siswa_id}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">
                        <img
                          // src={item.foto}
                          // alt=""
                          // className="h-16 w-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                        <div className="max-w-xs sm:max-w-sm line-clamp-2">
                          {item.deskripsi}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                        <Badge status={item.status} />
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setSelected(item);
                              setShowModal(true);
                            }}
                            className="p-1 text-yellow-500 hover:text-yellow-700 transition-colors"
                            aria-label="Edit prestasi"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Hapus prestasi"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <ModalPrestasi
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                setSelected(null);
              }}
              onSuccess={() => {
                fetchData();
                setShowModal(false);
              }}
              initialData={selected}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Prestasi;
