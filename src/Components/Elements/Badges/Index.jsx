const Badge = ({ status }) => {
  const baseStyle =
    "inline-flex px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap transition-all duration-300";

  const colorMap = {
    // Presensi
    hadir:
      "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400",
    izin: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400",
    sakit: "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400",
    alpha: "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400",
    ojt: "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400",
    ijt: "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400",

    // Pelanggaran/Prestasi
    pengajuan:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400",
    ditolak: "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400",
    disetujui:
      "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400",
    selesai:
      "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400",
  };

  const label =
    status === "ijt" || status === "ojt"
      ? status.toUpperCase()
      : status?.charAt(0).toUpperCase() + status?.slice(1) || "Tidak diketahui";

  return (
    <span
      className={
        baseStyle +
        " " +
        (colorMap[status] ||
          "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200")
      }
    >
      {label}
    </span>
  );
};

export default Badge;
