import { formatTanggal } from "../../../../utils/dateFormatter";

const DetailSiswa = ({ isOpen, onClose, siswa, kelas }) => {
  if (!isOpen || !siswa) {
    return null;
  }

  const kelasInfo = kelas[siswa.id_kelas];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-[32rem] shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Detail Siswa</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NISN
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 bg-gray-50">
              {siswa.nisn}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NIS
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 bg-gray-50">
              {siswa.nis}
            </p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 bg-gray-50">
              {siswa.nama_lengkap}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jenis Kelamin
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 bg-gray-50">
              {siswa.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Lahir
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 bg-gray-50">
              {formatTanggal(siswa.tanggal_lahir)}
            </p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Alamat
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 bg-gray-50">
              {siswa.alamat}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              No. Telepon
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 bg-gray-50">
              {siswa.no_telp}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Semester
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 bg-gray-50">
              {siswa.semester}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kelas
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 bg-gray-50">
              {kelasInfo?.nama_kelas}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailSiswa;
