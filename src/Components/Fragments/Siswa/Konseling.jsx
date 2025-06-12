import { useNavigate } from "react-router-dom";
import { FaUserLock, FaUsers } from "react-icons/fa";

const Konseling = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Pilih Jenis Konseling
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div
            onClick={() => navigate("/dashboard-siswa/konseling/public")}
            className="cursor-pointer group bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white p-6 rounded-xl transition transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center"
          >
            <FaUsers className="text-4xl mb-4" />
            <h2 className="text-xl font-semibold">Public Chat</h2>
            <p className="text-sm mt-2">
              Konseling terbuka dengan identitas kamu terlihat oleh konselor.
            </p>
          </div>

          <div
            onClick={() => navigate("/dashboard-siswa/konseling/private")}
            className="cursor-pointer group bg-gradient-to-br from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white p-6 rounded-xl transition transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center"
          >
            <FaUserLock className="text-4xl mb-4" />
            <h2 className="text-xl font-semibold">Private Chat</h2>
            <p className="text-sm mt-2">
              Konseling anonim. Konselor tidak mengetahui identitas kamu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Konseling;
