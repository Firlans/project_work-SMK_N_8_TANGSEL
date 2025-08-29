import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import { MdEmail } from "react-icons/md";
import { generateViolationNotificationEmail } from "../../../../utils/emailPelanggaran";

const PelanggaranSummary = ({ refreshTrigger }) => {
  const [allData, setAllData] = useState([]); // semua data summary
  const [data, setData] = useState([]); // data untuk halaman sekarang
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(allData.length / perPage);
  const [sortConfig, setSortConfig] = useState({
    key: "total_poin",
    direction: "desc",
  });
  const [loadingEmailIds, setLoadingEmailIds] = useState([]); // array id siswa yang lagi loading

  const fetchSummary = async () => {
    try {
      const res = await axiosClient.get(`/pelanggaran/summary`);
      setAllData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // slice data setiap kali allData atau page berubah
  useEffect(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    setData(allData.slice(start, end));
  }, [allData, page]);

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const handleSendEmail = async (item) => {
    if (!item.wali_murid || item.wali_murid.length === 0) return;

    try {
      // tandai loading
      setLoadingEmailIds((prev) => [...prev, item.id]);

      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(
        2,
        "0"
      )}/${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}/${today.getFullYear()}`;

      // generate template email
      const emailHtml = generateViolationNotificationEmail({
        studentName: item.nama_lengkap,
        totalPoints: item.total_poin,
        detailsUrl: "https://smkn8tangerangselatan.site/",
      });

      // kirim ke semua wali murid
      for (const wali of item.wali_murid) {
        await axiosClient.post(`/send-email/${wali.email}`, {
          subject: `Peringatan Pelanggaran Siswa - ${formattedDate}`,
          template: emailHtml,
        });
      }

      alert("Email berhasil dikirim ke wali murid.");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Gagal mengirim email!");
    } finally {
      // hapus loading
      setLoadingEmailIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div>
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
            <thead>
              <tr>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-300">
                  No
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-300 cursor-pointer"
                  onClick={() => requestSort("nama_lengkap")}
                >
                  Nama Siswa {getSortIcon("nama_lengkap")}
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-300 cursor-pointer"
                  onClick={() => requestSort("nisn")}
                >
                  NISN {getSortIcon("nisn")}
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-300 cursor-pointer"
                  onClick={() => requestSort("total_poin")}
                >
                  Jumlah Poin {getSortIcon("total_poin")}
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-300 cursor-pointer"
                  onClick={() => requestSort("jumlah_pelanggaran")}
                >
                  Jumlah Pelanggaran {getSortIcon("jumlah_pelanggaran")}
                </th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-300">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada data pelanggaran.
                  </td>
                </tr>
              ) : (
                sortedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="text-center px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                      {item.nama_lengkap}
                    </td>
                    <td className="text-center px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                      {item.nisn}
                    </td>
                    <td className="text-center px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                      {item.total_poin}
                    </td>
                    <td className="text-center px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                      {item.jumlah_pelanggaran}
                    </td>
                    <td className="text-center px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                      <div className="relative group inline-block">
                        <button
                          className="text-green-600 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          onClick={() => handleSendEmail(item)}
                          disabled={
                            item.total_poin <= 5 ||
                            item.email_ortu ||
                            loadingEmailIds.includes(item.id)
                          }
                        >
                          {loadingEmailIds.includes(item.id) ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5 text-green-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                              </svg>
                              Mengirim...
                            </>
                          ) : (
                            <MdEmail />
                          )}
                        </button>

                        {item.total_poin <= 5 && (
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg">
                            Poin masih di bawah 10
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination control */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700 dark:text-gray-200">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PelanggaranSummary;
