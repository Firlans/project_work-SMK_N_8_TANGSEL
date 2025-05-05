import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import { formatTanggal } from "../../../utils/dateFormatter";
import Badge from "../../Elements/Badges/Index";
import Button from "../../Elements/Button";
import ModalPelanggaran from "./FormPelanggaran";

const Pelanggaran = () => {
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Daftar Pelanggaran</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            setSelected(null);
            setShowModal(true);
          }}
        >
          Tambah Pelanggaran
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">No</th>
              <th className="p-2">Nama Terlapor</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Jenis Pelanggaran</th>
              <th className="p-2">Bukti</th>
              <th className="p-2">Deskripsi</th>
              <th className="p-2">Status</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={item.id} className="border-b">
                <td className="p-2 text-center">{idx + 1}</td>
                <td className="p-2">{item.nama_terlapor}</td>
                <td className="p-2">{formatTanggal(item.created_at)}</td>
                <td className="p-2">{item.nama_pelanggaran}</td>
                <td className="p-2">
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
                <td className="p-2">{item.deskripsi}</td>
                <td className="p-2 text-center">
                  <Badge status={item.status} />
                </td>
                <td className="p-2 space-x-2 text-center">
                  <Button
                    onClick={() => {
                      setSelected(item);
                      setShowModal(true);
                    }}
                    className="bg-yellow-400 px-2 py-1 rounded text-white"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </Button>
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
      )}
    </div>
  );
};

export default Pelanggaran;
