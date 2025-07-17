import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosClient from "../../../axiosClient";
import ModalPelanggaran from "../Admin/Data Pelanggaran/FormPelanggaran";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { FaEye, FaPlus } from "react-icons/fa6";
import Badge from "../../Elements/Badges/Index";
import { formatTanggal } from "../../../utils/dateFormatter";
import useReadOnlyRole from "../../../hooks/useReadOnlyRole";
import ImagePreview from "../../Elements/Image Pop Up/ImagePreview";

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

const PelanggaranSiswa = () => {
  const [dataPelapor, setDataPelapor] = useState([]);
  const [dataTerlapor, setDataTerlapor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const isReadOnly = useReadOnlyRole();
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let id_user, id_siswa;

      if (isReadOnly) {
        id_user = Cookies.get("user_id");
        id_siswa = Cookies.get("id_siswa");
        if (!id_user || !id_siswa) {
          throw new Error("User atau siswa tidak ditemukan di cookie");
        }
      } else {
        const cookie = Cookies.get("userPrivilege");
        if (!cookie) throw new Error("User tidak ditemukan di cookie");
        const parsed = JSON.parse(cookie);
        id_user = parsed.id_user;

        const siswaRes = await axiosClient.get("/siswa");
        const semuaSiswa = siswaRes.data.data;
        const siswaLogin = semuaSiswa.find((s) => s.user_id === id_user);
        if (!siswaLogin) {
          setLoading(false);
          return;
        }
        id_siswa = siswaLogin.id;
      }

      const pelaporRes = await axiosClient.get(
        `/pelanggaran/pelapor/${id_user}`
      );
      const pelaporRaw = pelaporRes.data.data;

      const enrichedPelapor = await Promise.all(
        pelaporRaw.map(async (item) => {
          try {
            const siswaRes = await axiosClient.get(`/siswa/${item.terlapor}`);
            return {
              ...item,
              nama_terlapor: siswaRes.data.data.nama_lengkap,
            };
          } catch (err) {
            return {
              ...item,
              nama_terlapor: "Tidak ditemukan",
            };
          }
        })
      );

      setDataPelapor(enrichedPelapor);

      const terlaporRes = await axiosClient.get(
        `/pelanggaran/terlapor/${id_siswa}`
      );
      const terlaporRaw = terlaporRes.data.data;

      const enrichedTerlapor = await Promise.all(
        terlaporRaw.map(async (item) => {
          try {
            const pelaporUserRes = await axiosClient.get(
              `/user/${item.pelapor}`
            );
            return {
              ...item,
              nama_pelapor:
                pelaporUserRes.data.data.nama_lengkap || "Tidak ditemukan",
            };
          } catch (err) {
            return {
              ...item,
              nama_pelapor: "Tidak ditemukan",
            };
          }
        })
      );

      setDataTerlapor(enrichedTerlapor);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm transition-all duration-300 ease-in-out">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* BAGIAN PELAPOR */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                Poin Negatif yang Dilaporkan
              </h2>
              {!isReadOnly && (
                <button
                  className="px-4 py-2 rounded flex items-center gap-2 bg-amber-500 dark:bg-slate-600 text-white hover:bg-amber-600 dark:hover:bg-slate-700 transition-colors duration-300"
                  onClick={() => {
                    setSelected(null);
                    setShowModal(true);
                  }}
                >
                  <FaPlus /> Tambah Poin Negatif
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 transition-all duration-300 ease-in-out">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                  <tr className="text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-all duration-300 ease-in-out">
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">Nama Siswa</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Jenis Poin Negatif</th>
                    <th className="px-6 py-3">Bukti</th>
                    <th className="px-6 py-3">Deskripsi</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                  {dataPelapor.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isReadOnly ? 7 : 8}
                        className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada data poin negatif yang kamu laporkan.
                      </td>
                    </tr>
                  ) : (
                    dataPelapor.map((item, idx) => (
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
                            <span className="text-gray-500 dark:text-gray-400">
                              -
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                          {item.deskripsi}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge status={item.status?.toLowerCase()} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BAGIAN TERLAPOR */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
              Poin Negatif yang Menimpa Kamu
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 transition-all duration-300 ease-in-out">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                  <tr className="text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-all duration-300 ease-in-out">
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Jenis Poin Negatif</th>
                    <th className="px-6 py-3">Bukti</th>
                    <th className="px-6 py-3">Deskripsi</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                  {dataTerlapor.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isReadOnly ? 7 : 8}
                        className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada data poin negatif yang menimpa kamu.
                      </td>
                    </tr>
                  ) : (
                    dataTerlapor.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                      >
                        <td className="px-6 py-4 text-center text-gray-800 dark:text-gray-100">
                          {idx + 1}
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
                            <span className="text-gray-500 dark:text-gray-400">
                              -
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                          {item.deskripsi}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge status={item.status?.toLowerCase()} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {isReadOnly && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 transition">
                  Anda login sebagai wali murid, hanya dapat melihat data.
                </div>
              )}
            </div>
          </div>

          {/* MODAL & PREVIEW */}
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

export default PelanggaranSiswa;
