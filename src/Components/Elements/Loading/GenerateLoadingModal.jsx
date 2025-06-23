import { PiSpinnerThin } from "react-icons/pi";

const GenerateLoadingModal = ({ progress }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 flex flex-col items-center gap-4 animate-fade-in transition-all duration-500 ease-in-out">
      <PiSpinnerThin className="text-blue-600 text-5xl animate-spin" />

      <div className="text-lg font-semibold text-gray-700 dark:text-gray-100 transition-colors duration-500">
        Sedang membuat pertemuan...
      </div>

      {progress && (
        <div className="text-sm text-gray-500 dark:text-gray-300 transition-colors duration-500">
          {progress}
        </div>
      )}

      <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-500">
        <div
          className="h-full bg-blue-500 animate-loading-bar transition-all duration-500"
          style={{ width: "80%" }}
        />
      </div>
    </div>

    <style>
      {`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes loading-bar {
          0% { width: 10%; }
          100% { width: 80%; }
        }
        .animate-loading-bar {
          animation: loading-bar 1.2s infinite alternate;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default GenerateLoadingModal;
