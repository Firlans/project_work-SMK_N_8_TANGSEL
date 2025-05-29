import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { formatTanggal } from "../../../../utils/dateFormatter";
import FormPertemuan from "./FormPertemuan";
import axiosClient from "../../../../axiosClient";
import { FaEye } from "react-icons/fa6";

const PertemuanList = ({
  data,
  onClickKehadiran,
  idJadwal,
  onRefresh,
  jadwal,
  kelas,
  mapel,
  mapelName,
  info,
}) => {
  const [selectedPertemuan, setSelectedPertemuan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleEdit = (item) => {
    setSelectedPertemuan(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pertemuan ini?")) return;

    try {
      await axiosClient.delete(`/pertemuan/${id}`);
      onRefresh();
    } catch (error) {
      console.error("Gagal menghapus pertemuan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daftar Pertemuan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Mata Pelajaran: <strong>{mapelName}</strong> | Kelas:{" "}
            <strong>{info?.namaKelas || "-"}</strong>
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPertemuan(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus />
          Tambah Pertemuan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2">No.</th>
              <th className="px-4 py-2">Nama Pertemuan</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.nama_pertemuan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTanggal(item.tanggal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          const slot = jadwal.find((j) => j.id === idJadwal);
                          const kelasData = kelas.find(
                            (k) => k.id === slot?.id_kelas
                          );
                          const mapelData = mapel.find(
                            (m) => m.id === slot?.id_mata_pelajaran
                          );

                          onClickKehadiran(item.id, {
                            namaKelas: kelasData?.nama_kelas || "-",
                            namaMapel: mapelData?.nama_pelajaran || "-",
                            namaPertemuan: item.nama_pertemuan || "-",
                          });
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        <FaEye />
                      </button>

                      <button
                        onClick={() => handleEdit(item)}
                        className="text-yellow-600 hover:underline text-sm"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan="4">
                  Belum ada pertemuan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <FormPertemuan
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedPertemuan(null);
          }}
          data={selectedPertemuan}
          idJadwal={idJadwal}
          onSuccess={() => {
            onRefresh();
            setShowForm(false);
          }}
          // idKelas={kelasData.id}
        />
      )}
    </div>
    // <div>
    //   {loading ? (
    //     <LoadingSpinner />
    //   ) : (
    //     <>

    //     </>
    //   )}
    // </div>
  );
};

export default PertemuanList;
