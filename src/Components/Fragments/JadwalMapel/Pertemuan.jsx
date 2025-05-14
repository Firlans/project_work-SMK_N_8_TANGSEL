import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { formatTanggal } from "../../../utils/dateFormatter";
import FormPertemuan from "./FormPertemuan";
import axiosClient from "../../../axiosClient";
import { FaEye } from "react-icons/fa6";

const PertemuanList = ({ data, onClickKehadiran, idJadwal, onRefresh }) => {
  const [selectedPertemuan, setSelectedPertemuan] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Daftar Pertemuan
        </h2>
        <button
          onClick={() => {
            setSelectedPertemuan(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus />
          Tambah Pertemuan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-sm text-left">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Nama Pertemuan</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id} className="border-t text-sm">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.nama_pertemuan}</td>
                  <td className="px-4 py-2">{formatTanggal(item.tanggal)}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => onClickKehadiran(item.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      <FaEye/>
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
        />
      )}
    </div>
  );
};

export default PertemuanList;
