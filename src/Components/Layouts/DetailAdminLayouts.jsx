import React from "react";
import { formatTanggal } from "../../utils/dateFormatter";

const DetailAdmin = ({ isOpen, onClose, admin }) => {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-all duration-300">
      <div className="relative top-20 mx-2 sm:mx-auto max-w-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md bg-white dark:bg-gray-900 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            Detail Admin
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 dark:text-gray-100 transition-colors duration-300">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              NIP
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
              {admin.nip}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Tanggal Lahir
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
              {formatTanggal(admin.tanggal_lahir)}
            </p>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Nama
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
              {admin.nama}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Jenis Kelamin
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
              {admin.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
            </p>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Alamat
            </label>
            <p className="mt-1 px-3 py-2 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
              {admin.alamat}
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

export default DetailAdmin;
