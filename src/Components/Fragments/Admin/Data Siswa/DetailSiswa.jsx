import { formatTanggal } from "../../../../utils/dateFormatter";

const DetailSiswa = ({ isOpen, onClose, siswa, kelas }) => {
  if (!isOpen || !siswa) {
    return null;
  }

  const kelasInfo = kelas[siswa.id_kelas];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md mx-4 sm:mx-0 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors">
            Detail Siswa
          </h3>
        </div>

        {/* Body Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            ["NISN", siswa.nisn],
            ["NIS", siswa.nis],
            ["Nama Lengkap", siswa.nama_lengkap, 2],
            [
              "Jenis Kelamin",
              siswa.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
            ],
            ["Tanggal Lahir", formatTanggal(siswa.tanggal_lahir)],
            ["Alamat", siswa.alamat, 2],
            ["No. Telepon", siswa.no_telp],
            ["Semester", siswa.semester],
            ["Kelas", kelasInfo?.nama_kelas],
          ].map(([label, value, colSpan = 1], index) => (
            <div key={index} className={`col-span-${colSpan}`}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                {label}
              </label>
              <p className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-600 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailSiswa;
