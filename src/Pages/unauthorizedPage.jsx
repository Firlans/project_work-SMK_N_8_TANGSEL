import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="text-gray-600 mt-2">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Kembali ke Login
      </button>
    </div>
  );
};

export default Unauthorized;
