import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { IoCloudUploadOutline, IoCloudDownloadOutline } from "react-icons/io5";
import Badge from "../../../Elements/Badges/Index";
import ModalPrestasi from "./FormPrestasi";
import Cookies from "js-cookie";
import ImagePreview from "../../../Elements/Image Pop Up/ImagePreview";
import { FaEye } from "react-icons/fa6";
import { downloadFile, uploadFile } from "../../../../services/fileService";

const DataPrestasi = () => {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [userPrivilege, setUserPrivilege] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(false);

  const getBuktiPrestasiURL = async (filename) => {
    try {
      const response = await axiosClient.get(`/images/prestasi/${filename}`, {
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      return null;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const result = await uploadFile(file);
    setLoading(false);

    if (result.success) {
      showNotification("File berhasil diupload", "success");
    } else {
      showNotification(result.message, "error");
    }
  };

  const handleFileDownload = async () => {
    setLoading(true);
    const result = await downloadFile();
    setLoading(false);

    if (result.success) {
      showNotification("File berhasil didownload", "success");
    } else {
      showNotification(result.message, "error");
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const fetchData = async () => {
    try {
      const res = await axiosClient.get("/prestasi");
      const prestasiWithNama = await Promise.all(
        res.data.data.map(async (item) => {
          const siswa = await axiosClient.get(`/siswa/${item.siswa_id}`);
          return {
            ...item,
            nama_siswa_id: siswa.data.data.nama_lengkap,
          };
        })
      );
      setData(prestasiWithNama);
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

    fetchData();
  }, []);

  const isSuperAdmin = () => {
    if (!userPrivilege) {
      return false;
    }
    const isSuperAdmin = userPrivilege.is_superadmin === 1;
    return isSuperAdmin;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axiosClient.delete(`/prestasi/${id}`);
      fetchData();
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              Data Sikap Positif
            </h2>

            {/* Button Group */}
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {/* Tambah Poin */}
              {!isSuperAdmin() && (
                <button
                  onClick={() => {
                    setSelected(null);
                    setShowModal(true);
                  }}
                  className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2 flex items-center gap-2 transition-colors duration-300"
                >
                  <FaPlus className="w-4 h-4" />
                  Tambah Sikap Positif
                </button>
              )}

              {/* Upload Button */}
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors duration-300">
                <IoCloudUploadOutline className="w-5 h-5" />
                Upload Pedoman
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Download Button */}
              <button
                onClick={handleFileDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
              >
                <IoCloudDownloadOutline className="w-5 h-5" />
                Download Pedoman
              </button>
            </div>

            {/* Spinner */}
            {loading && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}

            {/* Notification */}
            {notification.show && (
              <div
                className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out
        ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}
        text-white text-sm font-medium`}
              >
                {notification.message}
              </div>
            )}
          </div>

          {/* Table */}
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                  <tr>
                    {[
                      "No",
                      "Nama Siswa",
                      "Foto",
                      "Jenis Sikap Positif",
                      "Deskripsi",
                      "Status",
                      "Aksi",
                    ]
                      .filter(Boolean)
                      .map((text, i) => (
                        <th
                          key={i}
                          className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-center text-gray-500 dark:text-gray-300 transition-colors"
                        >
                          {text}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada data Sikap Positif.
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                      >
                        <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                          <div className="max-w-xs break-words">
                            {" "}
                            {index + 1}
                          </div>{" "}
                        </td>
                        <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                          <div className="max-w-xs break-words">
                            {" "}
                            {item.nama_siswa_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                          <div className="flex justify-center items-center min-h-[1.5rem]">
                            {" "}
                            {/* min height biar gak nyempil */}
                            {item.nama_foto ? (
                              <button
                                onClick={async () => {
                                  const imageUrl = await getBuktiPrestasiURL(
                                    item.nama_foto
                                  );
                                  if (imageUrl) setPreviewImage(imageUrl);
                                }}
                                className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
                                aria-label="Lihat bukti prestasi"
                              >
                                <FaEye />
                              </button>
                            ) : (
                              <span className="text-center text-gray-400">
                                -
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                          <div className="max-w-xs break-words">
                            {item.nama_prestasi}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                          <div className="max-w-xs break-words">
                            {item.deskripsi}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                          <Badge status={item.status} />
                        </td>

                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          <div className="flex gap-2 justify-center">
                            {!isSuperAdmin() && (
                              <button
                                onClick={() => {
                                  setSelected(item);
                                  setShowModal(true);
                                }}
                                className="p-1 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                                aria-label="Edit prestasi"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                            )}
                            {isSuperAdmin() && (
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                aria-label="Hapus prestasi"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modals */}
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

export default DataPrestasi;
