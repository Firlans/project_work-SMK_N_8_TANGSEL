import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import { formatTanggal } from "../../../../utils/dateFormatter";
import Badge from "../../../Elements/Badges/Index";
import ModalPelanggaran from "./FormPelanggaran";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";

const DataPelanggaran = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [userPrivilege, setUserPrivilege] = useState(null);

  // Fungsi untuk mengecek role user
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
      console.log("Raw data pelanggaran:", res.data.data);

      let filteredData = res.data.data;

      // Filter data untuk guru dan siswa
      if (
        (userRole === "guru" || userRole === "siswa") &&
        userPrivilege?.id_user
      ) {
        filteredData = res.data.data.filter(
          (item) => item.pelapor === userPrivilege.id_user
        );
        console.log("Filtered data for user:", filteredData);
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

      console.log("Final data with names:", pelanggaranWithNama);
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

  // Fungsi untuk mengecek apakah user bisa edit/delete
  const canModifyData = (item) => {
    const userRole = checkUserRole();

    // Admin dan konselor bisa modify semua data
    if (userRole === "admin" || userRole === "conselor") return true;

    // Guru dan siswa hanya bisa modify data mereka
    if (
      (userRole === "guru" || userRole === "siswa") &&
      item.pelapor === userPrivilege?.id_user
    )
      return true;

    return false;
  };

  // Fungsi untuk mengecek apakah user bisa menambah data
  const canAddData = () => {
    const userRole = checkUserRole();
    return userRole !== "superadmin"; // Semua role bisa tambah data kecuali superadmin
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
            {canAddData() && (
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
                        {canModifyData(item) && (
                          <>
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
                          </>
                        )}
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
