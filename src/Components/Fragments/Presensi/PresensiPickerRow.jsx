import { FaEdit, FaTrash } from "react-icons/fa";
import Badge from "../../Elements/Badges/Index";

const statusOptions = ["Hadir", "Izin", "Sakit", "Alpha", "OJT", "IJT"];

const PresensiPickerRow = ({
  idx,
  siswa,
  statusPresensi,
  selectedStatus,
  selectedKeterangan,
  onSelectStatus,
  onEdit,
  onDelete,
  onKeteranganChange,
}) => {
  const currentStatus = selectedStatus[siswa.id] || statusPresensi?.status;
  const currentKeterangan =
    selectedKeterangan[siswa.id] || statusPresensi?.keterangan || "";

  const isEditing =
    selectedStatus[siswa.id] !== undefined ||
    statusPresensi?.status === null ||
    statusPresensi === null;

  return (
    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 text-sm sm:text-base">
      {/* NO */}
      <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-200">
        {idx + 1}
      </td>

      {/* NAMA */}
      <td className="px-4 py-3 whitespace-nowrap text-slate-800 dark:text-white font-medium">
        {siswa.nama_lengkap}
      </td>

      {/* STATUS */}
      <td className="px-4 py-3 whitespace-nowrap">
        {isEditing ? (
          <select
            value={currentStatus || ""}
            onChange={(e) => onSelectStatus(siswa.id, e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
          >
            <option value="">Pilih Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s.toLowerCase()}>
                {s}
              </option>
            ))}
          </select>
        ) : currentStatus ? (
          <Badge status={currentStatus} />
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>

      {/* KETERANGAN */}
      <td className="px-4 py-3">
        {isEditing ? (
          <input
            type="text"
            placeholder="Keterangan (opsional)"
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
            value={currentKeterangan}
            onChange={(e) => onKeteranganChange(siswa.id, e.target.value)}
          />
        ) : currentKeterangan ? (
          <span className="text-slate-700 dark:text-slate-300">
            {currentKeterangan}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>

      {/* AKSI */}
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(siswa.id)}
            className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => onDelete(siswa.id)}
            className="text-red-500 hover:text-red-600 transition-colors duration-200"
            title="Hapus"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PresensiPickerRow;
