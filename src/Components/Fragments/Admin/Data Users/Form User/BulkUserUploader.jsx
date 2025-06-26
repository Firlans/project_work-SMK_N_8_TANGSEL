import { useBulkUplouder } from "./useBulkUplouder";
import GenerateLoadingModal from "../../../../Elements/Loading/GenerateLoadingModal";

const ModalBulkUploader = ({ onClose, onSuccess }) => {
  const {
    file,
    uploading,
    log,
    showLoading,
    progressText,
    uploadPercentage,
    handleFileChange,
    parseFile,
  } = useBulkUplouder(onSuccess);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      {showLoading && (
        <GenerateLoadingModal
          progress={progressText}
          percentage={uploadPercentage}
        />
      )}

      {!showLoading && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Upload Banyak User (.csv / .xlsx)
          </h2>

          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="w-full mb-4 text-sm border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
          />

          <button
            onClick={parseFile}
            disabled={!file || uploading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            {uploading ? "Mengupload..." : "Mulai Upload"}
          </button>

          {log.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Hasil Upload</h3>
              <ul className="space-y-1 max-h-40 overflow-y-auto text-sm">
                {log.map((item, i) => (
                  <li
                    key={i}
                    className={`${
                      item.status === "error"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {i + 1}. {item.name} -{" "}
                    {item.status === "error"
                      ? `Gagal: ${item.message}`
                      : "Berhasil"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end mt-6 gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-zinc-500"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalBulkUploader;
