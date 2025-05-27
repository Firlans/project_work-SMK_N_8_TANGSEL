import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import { formatTanggal } from "../../../../utils/dateFormatter";
import Badge from "../../../Elements/Badges/Index";
import ModalPelanggaran from "./FormPelanggaran";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const DataPelanggaran = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axiosClient.get("/pelanggaran");
      console.log("Data pelanggaran:", res.data.data);
      const pelanggaranWithNama = await Promise.all(
        res.data.data.map(async (item) => {
          const siswa = await axiosClient.get(`/siswa/${item.terlapor}`);
          return {
            ...item,
            nama_terlapor: siswa.data.data.nama_lengkap,
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
      await axiosClient.delete(`/pelanggaran/${id}`);
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Daftar Pelanggaran
            </h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => {
                setSelected(null);
                setShowModal(true);
              }}
            >
              <FaPlus /> Tambah Pelanggaran
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Nama Terlapor</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Jenis Pelanggaran</th>
                  <th className="px-6 py-3">Bukti</th>
                  <th className="px-6 py-3">Deskripsi</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.nama_terlapor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatTanggal(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.nama_pelanggaran}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.nama_foto ? (
                        <img
                          src={`http://localhost:8000/storage/pelanggaran/${item.nama_foto}`}
                          alt="Bukti"
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.deskripsi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setSelected(item);
                            setShowModal(true);
                          }}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showModal && (
            <ModalPelanggaran
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
          )}{" "}
        </>
      )}
    </div>
  );
};

export default DataPelanggaran;
