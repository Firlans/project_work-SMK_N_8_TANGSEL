import { useParams, useNavigate, useLocation } from "react-router-dom";
import usePresensiPicker from "./usePresensiPicker";
import PresensiPickerTable from "./PresensiPickerTable";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { IoChevronBackSharp } from "react-icons/io5";
import { capitalizeEachWord } from "../../../utils/capitalizeEachWord";

const PresensiList = () => {
  const { idJadwal, idPertemuan } = useParams();
  const {
    siswaList,
    presensi,
    selectedStatus,
    selectedKeterangan,
    loading,
    loadingSave,
    updateSelection,
    updateKeterangan,
    clearSelection,
    saveAll,
    editPresensi,
    deletePresensi,
  } = usePresensiPicker(idJadwal, idPertemuan);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { namaKelas, namaMapel, namaPertemuan } = state || {};

  if (loading) return <LoadingSpinner text={"Memuat presensi..."} />;

  return (
    <div className="relative">
      {/* SPINNER OVERLAY SAAT MENYIMPAN */}
      {loadingSave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <LoadingSpinner text="Menyimpan presensi..." />
        </div>
      )}

      {/* KONTEN UTAMA */}
      <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl shadow transition-colors duration-300">
        <div className="flex justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Presensi Siswa
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Mapel: <strong>{capitalizeEachWord(namaMapel || "-")}</strong> | Kelas:{" "}
              <strong>{namaKelas || "-"}</strong> | Pertemuan:{" "}
              <strong>{namaPertemuan || "-"}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2  flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
          >
            <IoChevronBackSharp />
            Kembali
          </button>
        </div>

        <PresensiPickerTable
          siswaList={siswaList}
          presensi={presensi}
          selectedStatus={selectedStatus}
          selectedKeterangan={selectedKeterangan}
          onSelectStatus={updateSelection}
          onKeteranganChange={updateKeterangan}
          onEdit={editPresensi}
          onDelete={deletePresensi}
        />

        {Object.keys(selectedStatus).length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={clearSelection}
                className="bg-gray-300 dark:bg-zinc-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors px-4 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={saveAll}
                className="bg-amber-500 dark:bg-zinc-800 text-white dark:text-white hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors px-4 py-2 rounded-lg"
                disabled={loadingSave}
              >
                {loadingSave ? "Menyimpan..." : "Simpan Semua"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresensiList;
