import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

const statusOptions = ["Hadir", "Izin", "Sakit", "Alpha"];

const PresensiList = ({ idPertemuan }) => {
  const [presensi, setPresensi] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [tanggalPertemuan, setTanggalPertemuan] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPresensi, resSiswa, resPertemuan] = await Promise.all([
          axiosClient.get(`/absen/pertemuan/${idPertemuan}`),
          axiosClient.get(`/siswa`),
          axiosClient.get(`/pertemuan/${idPertemuan}`),
        ]);

        setPresensi(resPresensi.data.data);
        setSiswaList(resSiswa.data.data);
        const sortedPresensi = resPresensi.data.data.sort((a, b) => {
          const namaA = getNamaSiswaFromList(
            resSiswa.data.data,
            a.id_siswa
          ).toLowerCase();
          const namaB = getNamaSiswaFromList(
            resSiswa.data.data,
            b.id_siswa
          ).toLowerCase();
          return namaA.localeCompare(namaB);
        });
        setPresensi(sortedPresensi);
        setTanggalPertemuan(resPertemuan.data.data.tanggal);
        console.log("Data presensi:", resPresensi.data.data);
        console.log("Data siswa:", resSiswa.data.data);
      } catch (error) {
        console.error("Gagal mengambil data presensi:", error);
      }
    };

    fetchData();
  }, [idPertemuan]);

  const getNamaSiswaFromList = (list, id) => {
    const siswa = list.find((s) => s.id === id);
    return siswa ? siswa.nama_lengkap : "";
  };

  const getNamaSiswa = (id) => {
    const siswa = siswaList.find((s) => s.id === id);
    return siswa ? siswa.nama_lengkap : "-";
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditedData({
      status: item.status,
      keterangan: item.keterangan || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleSave = async (item) => {
    try {
      const payload = {
        id_siswa: item.id_siswa,
        status: editedData.status?.toLowerCase(), // backend expects lowercase
        keterangan: editedData.keterangan || null,
        tanggal: tanggalPertemuan,
        id_pertemuan: idPertemuan,
      };

      await axiosClient.put(`/absen/${item.id}`, payload);

      // Update local state
      setPresensi((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                status: editedData.status,
                keterangan: editedData.keterangan,
              }
            : p
        )
      );

      console.log("Perubahan berhasil disimpan.", payload);

      handleCancel();
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        sentData: editedData,
      });
      alert("Gagal menyimpan perubahan.");
    }
  };

  const handleDelete = async (item) => {
    try {
      const payload = {
        id_siswa: item.id_siswa,
        status: null,
        keterangan: null,
        tanggal: tanggalPertemuan,
        id_pertemuan: idPertemuan,
      };

      await axiosClient.put(`/absen/${item.id}`, payload);

      setPresensi((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: null, keterangan: null } : p
        )
      );

      console.log("Status dan keterangan berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus status dan keterangan:", error);
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Daftar Presensi</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">No.</th>
              <th className="px-6 py-3">Nama Siswa</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Keterangan</th>
              <th className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {presensi.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getNamaSiswa(item.id_siswa)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {editingId === item.id ? (
                    <select
                      className="rounded px-2 py-1"
                      value={editedData.status || ""}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          status: e.target.value || null,
                        }))
                      }
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : item.status ? (
                    item.status.charAt(0).toUpperCase() + item.status.slice(1)
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      className="px-2 py-1 rounded w-full"
                      value={editedData.keterangan || ""}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          keterangan: e.target.value || null,
                        }))
                      }
                    />
                  ) : (
                    item.keterangan || "-"
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {editingId === item.id ? (
                    <>
                      <button
                        className="text-green-600 hover:underline mr-2"
                        onClick={() => handleSave(item)}
                      >
                        Simpan
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={handleCancel}
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button
                        className="text-yellow-500 hover:text-yellow-700"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {presensi.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-4">
                  Tidak ada data presensi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresensiList;
