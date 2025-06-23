import { useNavigate } from "react-router-dom";
import { FiLock, FiUnlock } from "react-icons/fi";

const Konseling = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
      <div className="w-full max-w-2xl p-8 transition-all duration-300">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center mb-8 transition-colors">
          Pilih Jenis Konseling
        </h1>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Public Chat Card */}
          <div
            onClick={() => navigate("/dashboard-siswa/konseling/public")}
            className="cursor-pointer group border border-blue-100 dark:border-blue-900 hover:border-blue-400 dark:hover:border-blue-600 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-300 p-6 rounded-xl transition duration-200 shadow-sm hover:shadow-md flex flex-col items-center text-center"
          >
            <FiUnlock className="text-3xl mb-3" />
            <h2 className="text-lg font-semibold">Public Chat</h2>
            <p className="text-sm mt-1 text-blue-700 dark:text-blue-400">
              Konselor dapat melihat identitas kamu.
            </p>
          </div>

          {/* Private Chat Card */}
          <div
            onClick={() => navigate("/dashboard-siswa/konseling/private")}
            className="cursor-pointer group border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 p-6 rounded-xl transition duration-200 shadow-sm hover:shadow-md flex flex-col items-center text-center"
          >
            <FiLock className="text-3xl mb-3" />
            <h2 className="text-lg font-semibold">Private Chat</h2>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
              Anonim. Konselor tidak mengetahui identitas kamu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Konseling;
