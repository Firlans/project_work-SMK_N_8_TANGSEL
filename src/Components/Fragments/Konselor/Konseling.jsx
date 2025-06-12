import { useNavigate } from "react-router-dom";

const Konseling = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Pilih Tipe Konseling
        </h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/dashboard-konselor/konseling/public")}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-xl transition duration-200 shadow-md"
          >
            🔓 Public Chat
          </button>

          <button
            onClick={() => navigate("/dashboard-konselor/konseling/private")}
            className="w-full px-6 py-4 bg-gray-800 hover:bg-gray-900 text-white text-lg font-medium rounded-xl transition duration-200 shadow-md"
          >
            🔒 Private Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Konseling;
