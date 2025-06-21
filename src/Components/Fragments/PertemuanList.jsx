import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { formatTanggal } from "../../utils/dateFormatter";
import { IoChevronBackSharp } from "react-icons/io5";
import LoadingSpinner from "../Elements/Loading/LoadingSpinner";
import Cookies from "js-cookie";
import FormPertemuan from "./Admin/Data Jadwal/FormPertemuan";
import { exportPresensiPDF } from "../../utils/exportPresensi";
import ExportLoadingModal from "../Elements/Loading/ExportLoadingModal";
import { PiExportBold } from "react-icons/pi";

const PertemuanList = () => {
  const { idJadwal } = useParams();
  const [pertemuan, setPertemuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [selectedPertemuan, setSelectedPertemuan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [info, setInfo] = useState({ namaKelas: "", namaMapel: "" });
  const navigate = useNavigate();
  const userRole = Cookies.get("userRole");
  const [exportProgress, setExportProgress] = useState(null);

  const fetchPertemuan = async () => {
    setLoading(true);
    try {
      const pertemuanRes = await axiosClient.get(
        `/pertemuan/jadwal/${idJadwal}`
      );
      setPertemuan(pertemuanRes.data.data);

      const jadwalRes = await axiosClient.get(`/jadwal/${idJadwal}`);
      const jadwal = jadwalRes.data.data;

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
        namaKelas: kelas?.nama_kelas || "-",
        namaMapel: mapel?.nama_pelajaran || "-",
      });
    } catch (error) {
      console.error("Gagal mengambil data pertemuan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idJadwal) fetchPertemuan();
  }, [idJadwal, refreshToggle]);

  const handleLihatPresensi = (p) => {
    const basePath =
      userRole === "guru"
        ? "/dashboard-guru/jadwal-guru"
        : "/dashboard-admin/data-jadwal";

    navigate(`${basePath}/${idJadwal}/pertemuan/${p.id}/presensi`, {
      state: {
        namaKelas: info.namaKelas,
        namaMapel: info.namaMapel,
        namaPertemuan: p.nama_pertemuan,
      },
    });
  };

  const handleEdit = (item) => {
    setSelectedPertemuan(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pertemuan ini?")) return;
    setLoading(true);
    try {
      await axiosClient.delete(`/pertemuan/${id}`);
      setRefreshToggle((prev) => !prev);
    } catch (error) {
      console.error("Gagal menghapus pertemuan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setRefreshToggle((prev) => !prev);
    setShowForm(false);
    setSelectedPertemuan(null);
  };

  const handleExportAllPresensi = async () => {
    setExportProgress("Memulai export...");
    try {
      await exportPresensiPDF({
        axiosClient,
        idJadwal,
        pertemuan,
        info,
        setExportProgress,
      });
    } catch (err) {
      alert("Gagal export presensi.");
      console.error("Export gagal:", err);
    } finally {
      setExportProgress(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Daftar Pertemuan
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Mata Pelajaran: <strong>{info.namaMapel}</strong> | Kelas:{" "}
            <strong>{info.namaKelas}</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
          {userRole !== "guru" && (
            <button
              onClick={() => {
                setSelectedPertemuan(null);
                setShowForm(true);
              }}
              className="flex-1 sm:flex-none min-w-[150px] bg-blue-500 text-white px-3 py-2 sm:px-4 rounded flex items-center justify-center gap-2 text-sm sm:text-base transition hover:bg-blue-600"
            >
              <FaPlus />
              <span className="hidden xs:inline">Tambah Pertemuan</span>
              <span className="inline xs:hidden">Tambah</span>
            </button>
          )}
          <button
            onClick={handleExportAllPresensi}
            disabled={!!exportProgress}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 text-sm font-semibold transition
              ${exportProgress ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <PiExportBold size={18} />
            {exportProgress ? "Mengekspor..." : "Export Presensi (PDF)"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none min-w-[120px] bg-blue-500 text-white px-3 py-2 sm:px-4 rounded flex items-center justify-center gap-2 text-sm sm:text-base transition hover:bg-blue-600"
          >
            <IoChevronBackSharp />
            <span className="inline xs:hidden">Kembali</span>
          </button>
        </div>
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
                        onClick={() => handleLihatPresensi(p)}
                      >
                        <FaEye />
                      </button>
                      {userRole !== "guru" && (
                        <>
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-yellow-600 hover:underline text-sm"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-400">
                  Tidak ada data pertemuan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <FormPertemuan
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedPertemuan(null);
        }}
        data={selectedPertemuan}
        idJadwal={idJadwal}
        onSuccess={handleFormSuccess}
      />

      {exportProgress && <ExportLoadingModal progress={exportProgress} />}
    </div>
  );
};

export default PertemuanList;
