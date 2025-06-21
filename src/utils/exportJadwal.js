import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportJadwalPDF({
  profile,
  hariMap,
  getDataByHari,
  role = "siswa",
}) {
  const doc = new jsPDF("portrait", "mm", "a4");
  const logoPath = "/images/logo-smkn8tangsel.png";
  let currentY = 60;

  doc.addImage(logoPath, "PNG", 14, 10, 25, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SMK NEGERI 8 KOTA TANGERANG SELATAN", 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text("JADWAL PEMBELAJARAN", 105, 22, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  if (role === "guru") {
    doc.text(`NAMA GURU : ${profile.nama_lengkap ?? "-"}`, 14, 40);
    doc.text(`NIP       : ${profile.nip ?? "-"}`, 14, 45);
  } else {
    doc.text(`NAMA SISWA : ${profile.nama_lengkap ?? "-"}`, 14, 40);
    doc.text(
      `NISN / NIS : ${profile.nisn ?? "-"} / ${profile.nis ?? "-"}`,
      14,
      45
    );
    doc.text(`KELAS      : ${profile.kelas ?? "-"}`, 14, 50);
  }

  const tableHeaders =
    role === "guru"
      ? ["Waktu", "Kelas", "Mata Pelajaran"]
      : ["Waktu", "Mata Pelajaran", "Guru"];

  for (const [idHari, namaHari] of Object.entries(hariMap)) {
    const rows = getDataByHari(Number(idHari));
    if (!rows.length) continue;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(namaHari.toUpperCase(), 14, currentY);
    currentY += 5;

    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: rows.map((r) => [r.waktu, r.mapel, r.guru]), // tetap pakai .guru karena di JadwalGuru lo spoof
      styles: { fontSize: 9, cellPadding: 3, valign: "middle" },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: 0,
        halign: "center",
        fontStyle: "bold",
      },
      margin: { left: 14, right: 14 },
      theme: "grid",
      didDrawPage: (data) => {
        currentY = data.cursor.y + 10;
      },
    });
  }

  const fileName = `jadwal-${(profile.nama_lengkap || "user").replace(
    /\s+/g,
    "_"
  )}.pdf`;
  doc.save(fileName);
}
