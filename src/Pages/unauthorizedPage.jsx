import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-gray-800">Akses Ditolak</h1>
        <p className="mt-3 text-base text-gray-500">
          Maaf, sesi Anda telah berakhir atau Anda tidak memiliki izin untuk
          melihat halaman ini.
        </p>

        <div className="mt-8">
          <button
            onClick={handleGoBack}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
