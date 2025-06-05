import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoChevronBackSharp } from "react-icons/io5";
import LoadingSpinner from "../Elements/Loading/LoadingSpinner";

const statusOptions = ["Hadir", "Izin", "Sakit", "Alpha"];

const PresensiList = () => {
  const { idJadwal, idPertemuan } = useParams();
  const [siswaList, setSiswaList] = useState([]);
  const [presensi, setPresensi] = useState([]);
  const [tanggalPertemuan, setTanggalPertemuan] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { namaKelas, namaMapel, namaPertemuan } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resJadwal = await axiosClient.get(`/jadwal/${idJadwal}`);
        const idKelas = resJadwal.data.data.id_kelas;

        const [resSiswa, resPresensi, resPertemuan] = await Promise.all([
          axiosClient.get("/siswa"),
          axiosClient.get(`/absen/pertemuan/${idPertemuan}`),
          axiosClient.get(`/pertemuan/${idPertemuan}`),
        ]);

        const siswaKelas = resSiswa.data.data.filter(
          (s) => s.id_kelas === idKelas
        );
        setSiswaList(siswaKelas);

        const dataPresensi = resPresensi.data.data;
        setTanggalPertemuan(resPertemuan.data.data.tanggal);

        // Gabungkan data siswa dengan presensi (jika sudah ada)
        const daftarGabungan = siswaKelas.map((siswa) => {
          const existing = dataPresensi.find((p) => p.id_siswa === siswa.id);
          return (
            existing || {
              id: null,
              id_siswa: siswa.id,
              status: null,
              keterangan: null,
            }
          );
        });

        setPresensi(
          daftarGabungan.sort((a, b) => {
            const namaA = getNamaSiswaFromList(
              siswaKelas,
              a.id_siswa
            ).toLowerCase();
            const namaB = getNamaSiswaFromList(
              siswaKelas,
              b.id_siswa
            ).toLowerCase();
            return namaA.localeCompare(namaB);
          })
        );
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idJadwal, idPertemuan]);

  const getNamaSiswaFromList = (list, id) => {
    const siswa = list.find((s) => s.id === id);
    return siswa ? siswa.nama_lengkap : "";
  };

  const handleEditClick = (item) => {
    setEditingId(item.id_siswa);
    setEditedData({
      status: item.status || "",
      keterangan: item.keterangan || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleSave = async (item) => {
    const payload = {
      id_siswa: item.id_siswa,
      id_pertemuan: idPertemuan,
      tanggal: tanggalPertemuan,
      status: editedData.status.toLowerCase(),
      keterangan: editedData.keterangan || "",
    };

    try {
      if (item.id) {
        await axiosClient.put(`/absen/${item.id}`, payload);
      } else {
        const res = await axiosClient.post("/absen", payload);
        item.id = res.data.data.id;
      }

      setPresensi((prev) =>
        prev.map((p) =>
          p.id_siswa === item.id_siswa
            ? { ...p, ...payload, id: item.id || p.id }
            : p
        )
      );

      handleCancel();
    } catch (error) {
      console.error("Gagal menyimpan presensi:", error);
      alert("Gagal menyimpan presensi.");
    }
  };

  const handleDelete = async (item) => {
    if (!item.id) return;
    try {
      await axiosClient.put(`/absen/${item.id}`, {
        ...item,
        status: null,
        keterangan: null,
      });

      setPresensi((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: null, keterangan: null } : p
        )
      );
    } catch (err) {
      console.error("Gagal menghapus presensi:", err);
      alert("Gagal menghapus.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Daftar Presensi
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Mata Pelajaran: <strong>{namaMapel || "-"}</strong> | Kelas:{" "}
            <strong>{namaKelas || "-"}</strong> | Pertemuan:{" "}
            <strong>{namaPertemuan || "-"}</strong>
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <IoChevronBackSharp /> Kembali
        </button>
      </div>

      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-sm text-left text-gray-500">
                  No
                </th>
                <th className="px-3 py-2 text-sm text-left text-gray-500">
                  Nama Siswa
                </th>
                <th className="px-3 py-2 text-sm text-left text-gray-500">
                  Status
                </th>
                <th className="px-3 py-2 text-sm text-left text-gray-500">
                  Keterangan
                </th>
                <th className="px-3 py-2 text-sm text-center text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {presensi.map((item, idx) => (
                <tr key={item.id_siswa}>
                  <td className="px-3 py-2 text-sm">{idx + 1}</td>
                  <td className="px-3 py-2 text-sm">
                    {getNamaSiswaFromList(siswaList, item.id_siswa)}
                  </td>
                  <td className="px-3 py-2 text-sm">
                    {editingId === item.id_siswa ? (
                      <select
                        value={editedData.status || ""}
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="">Pilih Status</option>
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : item.status ? (
                      item.status.charAt(0).toUpperCase() + item.status.slice(1)
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm">
                    {editingId === item.id_siswa ? (
                      <input
                        type="text"
                        value={editedData.keterangan || ""}
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            keterangan: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      item.keterangan || "-"
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm text-center">
                    {editingId === item.id_siswa ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded"
                          onClick={() => handleSave(item)}
                        >
                          Simpan
                        </button>
                        <button
                          className="bg-gray-300 px-2 py-1 rounded"
                          onClick={handleCancel}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-yellow-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-500"
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
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    Tidak ada data siswa.
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
