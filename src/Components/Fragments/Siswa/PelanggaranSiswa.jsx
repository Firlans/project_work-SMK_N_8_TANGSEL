import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosClient from "../../../axiosClient";
import ModalPelanggaran from "../Admin/Data Pelanggaran/FormPelanggaran";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa6";
import Badge from "../../Elements/Badges/Index";
import { FaEdit } from "react-icons/fa";
import { formatTanggal } from "../../../utils/dateFormatter";
import useReadOnlyRole from "../../../hooks/useReadOnlyRole";
import ImagePreview from "../../Elements/Image Pop Up/ImagePreview";

const getBuktiPelanggaranURL = (filename) =>
  axiosClient.defaults.baseURL + "/images/pelanggaran/" + filename;

const PelanggaranSiswa = () => {
  const [dataPelapor, setDataPelapor] = useState([]);
  const [dataTerlapor, setDataTerlapor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const isReadOnly = useReadOnlyRole();
  const [previewImage, setPreviewImage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let id_user, id_siswa;

      if (isReadOnly) {
        // Ambil dari cookies yang sudah diset di ProfileSiswa
        id_user = Cookies.get("user_id");
        id_siswa = Cookies.get("id_siswa");
        if (!id_user || !id_siswa) {
          throw new Error("User atau siswa tidak ditemukan di cookie");
        }
      } else {
        // Mode siswa biasa
        const cookie = Cookies.get("userPrivilege");
        if (!cookie) throw new Error("User tidak ditemukan di cookie");
        const parsed = JSON.parse(cookie);
        id_user = parsed.id_user;

        // Ambil semua siswa
        const siswaRes = await axiosClient.get("/siswa");
        const semuaSiswa = siswaRes.data.data;
        const siswaLogin = semuaSiswa.find((s) => s.user_id === id_user);
        if (!siswaLogin) {
          console.error("Siswa terkait user tidak ditemukan");
          setLoading(false);
          return;
        }
        id_siswa = siswaLogin.id;
      }

      // Fetch pelanggaran pelapor (berdasarkan id_user)
      const pelaporRes = await axiosClient.get(
        `/pelanggaran/pelapor/${id_user}`
      );
      const pelaporRaw = pelaporRes.data.data;

      // Enrich pelanggaran pelapor dengan nama_terlapor
      const enrichedPelapor = await Promise.all(
        pelaporRaw.map(async (item) => {
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

      setDataPelapor(enrichedPelapor);

      // Fetch pelanggaran terlapor (berdasarkan id_siswa)
      const terlaporRes = await axiosClient.get(
        `/pelanggaran/terlapor/${id_siswa}`
      );
      const terlaporRaw = terlaporRes.data.data;

      // Enrich pelanggaran terlapor dengan nama_pelapor
      const enrichedTerlapor = await Promise.all(
        terlaporRaw.map(async (item) => {
          try {
            const pelaporUserRes = await axiosClient.get(
              `/user/${item.pelapor}`
            );
            // Asumsi endpoint user untuk nama pelapor, sesuaikan kalau beda
            return {
              ...item,
              nama_pelapor:
                pelaporUserRes.data.data.nama_lengkap || "Tidak ditemukan",
            };
          } catch (err) {
            console.error(`Gagal ambil nama pelapor ID ${item.pelapor}:`, err);
            return {
              ...item,
              nama_pelapor: "Tidak ditemukan",
            };
          }
        })
      );

      setDataTerlapor(enrichedTerlapor);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Pelanggaran yang Dilaporkan
              </h2>
              {!isReadOnly && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                  onClick={() => {
                    setSelected(null);
                    setShowModal(true);
                  }}
                >
                  <FaPlus /> Tambah Pelanggaran
                </button>
              )}
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
                    {!isReadOnly && <th className="px-6 py-3">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataPelapor.map((item, idx) => (
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
                      <td className="px-6 py-4">
                        {item.nama_foto ? (
                          <button
                            onClick={() =>
                              setPreviewImage(
                                getBuktiPrestasiURL(item.nama_foto)
                              )
                            }
                            className="text-blue-600 hover:underline"
                          >
                            <FaEye />
                          </button>
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
                      {!isReadOnly && (
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
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Pelanggaran yang Menimpa Kamu
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">No</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Jenis Pelanggaran</th>
                    <th className="px-6 py-3">Bukti</th>
                    <th className="px-6 py-3">Deskripsi</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataTerlapor.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTanggal(item.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                            className="text-blue-600 hover:underline"
                          >
                            <FaEye />
                          </button>
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
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Info read only */}
              {isReadOnly && (
                <div className="mt-4 text-sm text-gray-500">
                  Anda login sebagai wali murid, hanya dapat melihat data.
                </div>
              )}
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
