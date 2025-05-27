import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
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
    <div className="w-full bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
          Daftar Presensi
        </h3>
      </div>

      {/* Table Container with horizontal scroll for small devices */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">
                  No.
                </th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">
                  Nama Siswa
                </th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">
                  Keterangan
                </th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {presensi.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-center text-xs sm:text-sm">
                    {index + 1}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                    {getNamaSiswa(item.id_siswa)}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-center text-xs sm:text-sm">
                    {editingId === item.id ? (
                      <select
                        className="w-full sm:w-auto rounded px-2 py-1 text-xs sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={editedData.status || ""}
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            status: e.target.value || null,
                          }))
                        }
                      >
                        <option value="">Pilih Status</option>
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-block min-w-[80px]">
                        {item.status
                          ? item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)
                          : "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        className="w-full rounded px-2 py-1 text-xs sm:text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={editedData.keterangan || ""}
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            keterangan: e.target.value || null,
                          }))
                        }
                      />
                    ) : (
                      <span className="line-clamp-2">
                        {item.keterangan || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                    {editingId === item.id ? (
                      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                        <button
                          className="w-full sm:w-auto px-3 py-1 text-xs sm:text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          onClick={() => handleSave(item)}
                        >
                          Simpan
                        </button>
                        <button
                          className="w-full sm:w-auto px-3 py-1 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          onClick={handleCancel}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          className="p-1 text-yellow-500 hover:text-yellow-700 transition-colors"
                          onClick={() => handleEditClick(item)}
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => handleDelete(item)}
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {presensi.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-3 sm:px-6 py-4 text-center text-gray-500 text-xs sm:text-sm"
                  >
                    Tidak ada data presensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PresensiList;
