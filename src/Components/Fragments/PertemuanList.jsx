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
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 transition-all duration-300">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white transition-colors">
            Daftar Pertemuan
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
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
              className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2 flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
            >
              <FaPlus className="w-4 h-4" />
              <span>Tambah Pertemuan</span>
            </button>
          )}
          <button
            onClick={handleExportAllPresensi}
            disabled={!!exportProgress}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white rounded-lg px-4 py-2 shadow hover:bg-red-700 text-sm font-semibold transition-colors duration-300 ${
              exportProgress ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <PiExportBold size={18} />
            {exportProgress ? "Mengekspor..." : "Export Presensi"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2  flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
          >
            <IoChevronBackSharp />
            <span className="inline xs:hidden">Kembali</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto transition-all duration-300">
        <table className="w-full text-sm transition-colors duration-300">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200">
            <tr>
              <th className="px-4 py-2">No.</th>
              <th className="px-4 py-2">Nama Pertemuan</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {pertemuan.length > 0 ? (
              pertemuan.map((p, index) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-center text-gray-800 dark:text-gray-100">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">
                    {p.nama_pertemuan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">
                    {formatTanggal(p.tanggal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm transition-colors"
                        onClick={() => handleLihatPresensi(p)}
                      >
                        <FaEye />
                      </button>
                      {userRole !== "guru" && (
                        <>
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-yellow-600 dark:text-yellow-400 hover:underline text-sm transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 dark:text-red-400 hover:underline text-sm transition-colors"
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
                <td
                  colSpan="4"
                  className="px-4 py-4 text-center text-gray-400 dark:text-gray-500"
                >
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
