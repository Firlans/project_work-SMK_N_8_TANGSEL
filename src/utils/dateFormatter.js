// Format tanggal ke bahasa Indonesia
export const formatTanggal = (tanggal) => {
  const d = new Date(tanggal);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format waktu jam:menit
export const formatWaktu = (waktu) => {
  if (!waktu) return "-";
  return waktu.slice(0, 5);
};
