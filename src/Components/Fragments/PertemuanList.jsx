import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { formatTanggal } from "../../utils/dateFormatter";
import { IoChevronBackSharp } from "react-icons/io5";
import LoadingSpinner from "../Elements/Loading/LoadingSpinner";

const PertemuanList = () => {
  const { idJadwal } = useParams();
  const [pertemuan, setPertemuan] = useState([]);
  const navigate = useNavigate();
  const [info, setInfo] = useState({ namaKelas: "", namaMapel: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const pertemuanRes = await axiosClient.get(
          `/pertemuan/jadwal/${idJadwal}`
        );
        setPertemuan(pertemuanRes.data.data);

        const jadwalRes = await axiosClient.get(`/jadwal/${idJadwal}`);
        const jadwal = jadwalRes.data.data;

        // Fetch kelas dan mapel
        const [kelasRes, mapelRes] = await Promise.all([
          axiosClient.get(`/kelas`),
          axiosClient.get(`/mata-pelajaran`),
        ]);
        const kelas = kelasRes.data.data.find(
          (item) => item.id === jadwal.id_kelas
        );
        const mapel = mapelRes.data.data.find(
          (item) => item.id === jadwal.id_mata_pelajaran
        );
        setInfo({
          namaKelas: kelas?.nama_kelas,
          namaMapel: mapel?.nama_pelajaran,
        });
        console.log("Data info:", info);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil data info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (idJadwal) fetchInfo();
  }, [idJadwal]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Daftar Pertemuan (Jadwal ID: {idJadwal})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Mata Pelajaran: <strong>{info.namaMapel}</strong> | Kelas:{" "}
            <strong>{info.namaKelas}</strong>
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <IoChevronBackSharp /> Kembali
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
            {pertemuan.length > 0 ? (
              pertemuan.map((p, index) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {p.nama_pertemuan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTanggal(p.tanggal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() =>
                          navigate(
                            `/dashboard-guru/jadwal-guru/${idJadwal}/pertemuan/${p.id}/presensi`,
                            {
                              state: {
                                namaKelas: info.namaKelas || "-",
                                namaMapel: info.namaMapel || "-",
                                namaPertemuan: p.nama_pertemuan || "-",
                              },
                            }
                          )
                        }
                      >
                        <FaEye />
                      </button>
                      <button className="text-yellow-600 hover:underline text-sm">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:underline text-sm">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                  Belum ada pertemuan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PertemuanList;
