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

const getBuktiPelanggaranURL = async (filename) => {
  try {
    const response = await axiosClient.get(`/images/pelanggaran/${filename}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    return null;
  }
};

const DataPelanggaran = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [userPrivilege, setUserPrivilege] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(false);

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
      setError(true);
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
        setError(true);
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
      setError(true);
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
              Data Poin Negatif
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
                Tambah Poin Negatif
              </button>
            )}
          </div>

          {/* Table */}
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                <thead className="">
                  <tr>
                    {[
                      "No",
                      "Nama Siswa",
                      "Tanggal",
                      "Jenis Poin Negatif",
                      "Bukti",
                      "Deskripsi",
                      "Status",
                      "Aksi",
                    ].map((head, i) => (
                      <th
                        key={i}
                        className={`px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium ${
                          head === "Status" || head === "Aksi"
                            ? "text-center"
                            : "text-left"
                        } text-gray-500 dark:text-gray-300 transition-colors`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada data pelanggaran.
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                          <div className="max-w-xs break-words"> {idx + 1}</div>{" "}
                        </td>
                        <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                          <div className="max-w-xs break-words">
                            {item.nama_terlapor}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                          <div className="max-w-xs break-words">
                            {formatTanggal(item.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                          <div className="max-w-xs break-words">
                            {item.nama_pelanggaran}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {item.nama_foto ? (
                            <button
                              onClick={async () => {
                                const imageUrl = await getBuktiPelanggaranURL(
                                  item.nama_foto
                                );
                                if (imageUrl) setPreviewImage(imageUrl);
                              }}
                              className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
                            >
                              <FaEye />
                            </button>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">
                              -
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
