import { formatTanggal } from "../../../../utils/dateFormatter";

const DetailGuru = ({ isOpen, onClose, guru, subjects }) => {
  if (!isOpen || !guru) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md mx-4 sm:mx-0 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            Detail Guru
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              NIP
            </label>
            <p className="px-3 py-2 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-300">
              {guru.nip}
            </p>
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tanggal Lahir
            </label>
            <p className="px-3 py-2 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-300">
              {formatTanggal(guru.tanggal_lahir)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama
            </label>
            <p className="px-3 py-2 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-300">
              {guru.nama}
            </p>
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jenis Kelamin
            </label>
            <p className="px-3 py-2 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-300">
              {guru.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
            </p>
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              No. Telepon
            </label>
            <p className="px-3 py-2 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-300">
              {guru.no_telp}
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alamat
            </label>
            <p className="px-3 py-2 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-300">
              {guru.alamat}
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mata Pelajaran
            </label>
            <p className="px-3 py-2 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-300">
              {guru.nama_pelajaran?.join(", ") || "-"}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white dark:text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailGuru;
