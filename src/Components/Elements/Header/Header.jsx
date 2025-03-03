import { useNavigate } from "react-router-dom";
import Button from "../Button";

const Headers = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate(-1)} className="text-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </button>
        <img
          src="images/logo-smkn8tangsel.png"
          alt="Logo SMK"
          className="w-12 h-12"
        />
        <h1 className="text-xl font-semibold">
          SMK Negeri 8 Kota Tangerang Selatan
        </h1>
      </div>
      <Button
        className="w-fit bg-red-600 text-white flex items-center"
        onClick={() => navigate("/")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
        Logout
      </Button>
    </header>
  );
};

export default Headers;
