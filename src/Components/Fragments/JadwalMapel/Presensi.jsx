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
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-4">Daftar Presensi</h3>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">No.</th>
            <th className="p-2 border">Nama Siswa</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Keterangan</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {presensi.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{getNamaSiswa(item.id_siswa)}</td>

              <td className="border p-2 text-center">
                {editingId === item.id ? (
                  <select
                    className="border rounded px-2 py-1"
                    value={editedData.status}
                    onChange={(e) =>
                      setEditedData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  item.status.charAt(0).toUpperCase() + item.status.slice(1)
                )}
              </td>

              <td className="border p-2 text-center">
                {editingId === item.id ? (
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={editedData.keterangan}
                    onChange={(e) =>
                      setEditedData((prev) => ({
                        ...prev,
                        keterangan: e.target.value,
                      }))
                    }
                  />
                ) : (
                  item.keterangan || "-"
                )}
              </td>

              <td className="border p-2 text-center">
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
                  <div className="flex justify-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEditClick(item)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:underline"
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
  );
};

export default PresensiList;
