const Badge = ({ status }) => {
    const baseStyle = "px-2 py-1 text-xs rounded-full font-medium ";
    const colorMap = {
      pengajuan: "bg-yellow-100 text-yellow-800",
      ditolak: "bg-red-100 text-red-800",
      selesai: "bg-green-100 text-green-800",
    };
  
    return <span className={baseStyle + (colorMap[status] || "bg-gray-200")}>{status}</span>;
  };
  
  export default Badge;
  