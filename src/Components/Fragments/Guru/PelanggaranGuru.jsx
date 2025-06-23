import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosClient from "../../../axiosClient";
import ModalPelanggaran from "../Admin/Data Pelanggaran/FormPelanggaran";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa6";
import Badge from "../../Elements/Badges/Index";
import { FaEdit } from "react-icons/fa";
import { formatTanggal } from "../../../utils/dateFormatter";
import ImagePreview from "../../Elements/Image Pop Up/ImagePreview";

const getBuktiPelanggaranURL = (filename) =>
  axiosClient.defaults.baseURL + "/images/pelanggaran/" + filename;

const PelanggaranGuru = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchPelanggaran = async () => {
    try {
      const cookie = Cookies.get("userPrivilege");
      const parsed = JSON.parse(cookie);
      const id_user = parsed.id_user;

      const res = await axiosClient.get(`/pelanggaran/pelapor/${id_user}`);
      const rawData = res.data.data;

      // Enrich data with nama_terlapor
      const enrichedData = await Promise.all(
        rawData.map(async (item) => {
          try {
            const siswaRes = await axiosClient.get(`/siswa/${item.terlapor}`);
            return {
              ...item,
              nama_terlapor: siswaRes.data.data.nama_lengkap,
            };
          } catch (err) {
            console.error(`Gagal ambil nama siswa ID ${item.terlapor}:`, err);
            return {
              ...item,
              nama_terlapor: "Tidak ditemukan",
            };
          }
        })
      );

      setData(enrichedData);
    } catch (err) {
      console.error("Gagal mengambil data pelanggaran:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPelanggaran();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axiosClient.delete(`/pelanggaran/${id}`);
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus data pelanggaran:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm transition-all duration-500 ease-in-out">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* BAGIAN PELAPOR */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                Pelanggaran yang Dilaporkan
              </h2>
              <button
                className="px-4 py-2 rounded flex items-center gap-2 bg-amber-500 dark:bg-slate-600 text-white hover:bg-amber-600 dark:hover:bg-slate-700 transition-colors duration-300"
                onClick={() => {
                  setSelected(null);
                  setShowModal(true);
                }}
              >
                <FaPlus /> Tambah Pelanggaran
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 transition-all duration-300 ease-in-out">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                  <tr className="text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-all duration-300 ease-in-out">
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
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada data pelanggaran yang Bapak/Ibu laporkan.
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                      >
                        <td className="px-6 py-4 text-center text-gray-800 dark:text-gray-100">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                          {item.nama_terlapor}
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                          {formatTanggal(item.created_at)}
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                          {item.nama_pelanggaran}
                        </td>
                        <td className="px-6 py-4">
                          {item.nama_foto ? (
                            <button
                              onClick={() =>
                                setPreviewImage(
                                  getBuktiPelanggaranURL(item.nama_foto)
                                )
                              }
                              className="text-blue-600 dark:text-blue-400 hover:underline transition"
                            >
                              <FaEye />
                            </button>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">
                              -
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                          {item.deskripsi}
                        </td>
                        <td className="px-6 py-4 text-center">
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showModal && (
            <ModalPelanggaran
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                setSelected(null);
              }}
              onSuccess={() => {
                fetchPelanggaran();
                setShowModal(false);
              }}
              initialData={selected}
            />
          )}
          <ImagePreview
            isOpen={!!previewImage}
            onClose={() => setPreviewImage(null)}
            imageUrl={previewImage}
          />
        </>
      )}
    </div>
  );
};

export default PelanggaranGuru;
