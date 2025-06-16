import { useNavigate } from "react-router-dom";
import { FiLock, FiUnlock } from "react-icons/fi";

const Konseling = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
          Pilih Jenis Konseling
        </h1>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Public Chat Card */}
          <div
            onClick={() => navigate("/dashboard-siswa/konseling/public")}
            className="cursor-pointer group border border-blue-100 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-800 p-6 rounded-xl transition duration-200 shadow-sm hover:shadow-md flex flex-col items-center text-center"
          >
            <FiUnlock className="text-3xl mb-3" />
            <h2 className="text-lg font-semibold">Public Chat</h2>
            <p className="text-sm mt-1 text-blue-700">
              Konselor dapat melihat identitas kamu.
            </p>
          </div>

          {/* Private Chat Card */}
          <div
            onClick={() => navigate("/dashboard-siswa/konseling/private")}
            className="cursor-pointer group border border-gray-200 hover:border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-800 p-6 rounded-xl transition duration-200 shadow-sm hover:shadow-md flex flex-col items-center text-center"
          >
            <FiLock className="text-3xl mb-3" />
            <h2 className="text-lg font-semibold">Private Chat</h2>
            <p className="text-sm mt-1 text-gray-700">
              Anonim. Konselor tidak mengetahui identitas kamu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Konseling;
