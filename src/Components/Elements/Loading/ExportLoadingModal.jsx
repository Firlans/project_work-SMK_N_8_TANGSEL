import { FaFilePdf } from "react-icons/fa";

const ExportLoadingModal = ({ progress }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-4 animate-fade-in">
      <FaFilePdf className="text-red-600 text-5xl animate-bounce" />
      <div className="text-lg font-semibold text-gray-700">
        Sedang mengekspor PDF...
      </div>
      <div className="text-sm text-gray-500">{progress}</div>
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 animate-loading-bar"
          style={{ width: "80%" }}
        />
      </div>
    </div>
    <style>
      {`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s; }
        @keyframes loading-bar { 0% { width: 10%; } 100% { width: 80%; } }
        .animate-loading-bar { animation: loading-bar 1.2s infinite alternate; }
      `}
    </style>
  </div>
);

export default ExportLoadingModal;
