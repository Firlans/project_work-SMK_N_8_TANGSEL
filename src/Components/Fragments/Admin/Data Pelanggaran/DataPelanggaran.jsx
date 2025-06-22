import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import { formatTanggal } from "../../../../utils/dateFormatter";
import Badge from "../../../Elements/Badges/Index";
import ModalPelanggaran from "./FormPelanggaran";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";
import ImagePreview from "../../../Elements/Image Pop Up/ImagePreview";
import { FaEye } from "react-icons/fa6";

const getBuktiPelanggaranURL = (filename) =>
  axiosClient.defaults.baseURL + "/images/pelanggaran/" + filename;

const DataPelanggaran = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [userPrivilege, setUserPrivilege] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const checkUserRole = () => {
    if (!userPrivilege) return null;
    if (userPrivilege.is_superadmin === 1) return "superadmin";
    if (userPrivilege.is_admin === 1) return "admin";
    if (userPrivilege.is_conselor === 1) return "conselor";
    if (userPrivilege.is_guru === 1) return "guru";
    if (userPrivilege.is_siswa === 1) return "siswa";
    return null;
  };

  const fetchData = async () => {
    try {
      const userRole = checkUserRole();
      const res = await axiosClient.get("/pelanggaran");

      let filteredData = res.data.data;

      if (
        (userRole === "guru" || userRole === "siswa") &&
        userPrivilege?.id_user
      ) {
        filteredData = filteredData.filter(
          (item) => item.pelapor === userPrivilege.id_user
        );
      }

      const pelanggaranWithNama = await Promise.all(
        filteredData.map(async (item) => {
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
    const privilegeData = Cookies.get("userPrivilege");
    if (privilegeData) {
      try {
        const parsedPrivilege = JSON.parse(privilegeData);
        setUserPrivilege(parsedPrivilege);
      } catch (error) {
        console.error("Error parsing privilege:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userPrivilege) {
      fetchData();
    }
  }, [userPrivilege]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axiosClient.delete(`/pelanggaran/${id}`);
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  const canModifyData = (item) => {
    const role = checkUserRole();
    if (role === "admin" || role === "conselor") return true;
    if (
      (role === "guru" || role === "siswa") &&
      item.pelapor === userPrivilege?.id_user
    )
      return true;
    return false;
  };

  const canAddData = () => {
    return checkUserRole() !== "superadmin";
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm transition-colors duration-300">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              Daftar Pelanggaran
            </h2>
            {canAddData() && (
              <button
                className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2  flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
                onClick={() => {
                  setSelected(null);
                  setShowModal(true);
                }}
              >
                <FaPlus className="w-4 h-4" />
                Tambah Pelanggaran
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm transition-all duration-300">
              <thead className="bg-gray-50 dark:bg-gray-800 transition-colors">
                <tr>
                  {[
                    "No",
                    "Nama Terlapor",
                    "Tanggal",
                    "Jenis Pelanggaran",
                    "Bukti",
                    "Deskripsi",
                    "Status",
                    "Aksi",
                  ].map((head, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 whitespace-nowrap transition-colors"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors">
                {data.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-100">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-100">
                      {item.nama_terlapor}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-100">
                      {formatTanggal(item.created_at)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-100">
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
                          className="text-blue-600 hover:underline dark:text-blue-400 transition-colors"
                        >
                          <FaEye />
                        </button>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-100">
                      <div className="max-w-xs break-words">
                        {item.deskripsi}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {canModifyData(item) && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setSelected(item);
                              setShowModal(true);
                            }}
                            className="text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal & Preview */}
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
              userPrivilege={userPrivilege}
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

export default DataPelanggaran;
