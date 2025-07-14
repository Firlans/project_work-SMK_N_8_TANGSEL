import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { capitalizeEachWord } from "./capitalizeEachWord";

export async function exportPresensiPDF({
  axiosClient,
  idJadwal,
  pertemuan,
  info,
  setExportProgress,
}) {
  const doc = new jsPDF("landscape", "mm", "a4");
  const logoPath = "/images/logo-smkn8tangsel.png";
  const mapStatus = { hadir: "H", izin: "I", sakit: "S", alfa: "A" };

  try {
    setExportProgress?.("Mengambil data jadwal...");
    const { data: jadwalRes } = await axiosClient.get(`/jadwal/${idJadwal}`);
    const idKelas = jadwalRes.data.id_kelas;

    setExportProgress?.("Mengambil data siswa...");
    const { data: siswaRes } = await axiosClient.get("/siswa");
    const siswaList = siswaRes.data.filter((s) => s.id_kelas === idKelas);

    setExportProgress?.("Mengambil data presensi...");
    const pertemuanSorted = [...pertemuan].sort(
      (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
    );
    const allPresensi = {};
    for (let i = 0; i < pertemuanSorted.length; i++) {
      setExportProgress?.(
        `Mengambil presensi pertemuan ${i + 1} dari ${
          pertemuanSorted.length
        }...`
      );
      const p = pertemuanSorted[i];
      const { data: presensiRes } = await axiosClient.get(
        `/absen/pertemuan/${p.id}`
      );
      allPresensi[p.id] = presensiRes.data;
    }

    setExportProgress?.("Membuat dokumen PDF...");
    doc.addImage(logoPath, "PNG", 10, 10, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SMK NEGERI 8 KOTA TANGERANG SELATAN", 40, 20);
    doc.setFontSize(12);
    doc.text("REKAP PRESENSI SISWA", 140, 35, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`KELAS: ${info.namaKelas}`, 140, 42, { align: "center" });
    doc.text(`MATA PELAJARAN: ${capitalizeEachWord(info.namaMapel)}`, 140, 49, { align: "center" });

    const headRow = [
      "No",
      "NIS",
      "Nama Siswa",
      ...pertemuanSorted.map((p, i) => `P-${i + 1}`),
      "H",
      "I",
      "S",
      "A",
    ];

    const bodyRows = siswaList.map((siswa, index) => {
      const statusList = pertemuanSorted.map((p) => {
        const data = allPresensi[p.id].find((ps) => ps.id_siswa === siswa.id);
        const status = data?.status?.toLowerCase();
        return mapStatus[status] ?? "-";
      });

      const rekap = {
        H: statusList.filter((s) => s === "H").length,
        I: statusList.filter((s) => s === "I").length,
        S: statusList.filter((s) => s === "S").length,
        A: statusList.filter((s) => s === "A").length,
      };

      return [
        index + 1,
        siswa.nis,
        siswa.nama_lengkap,
        ...statusList,
        rekap.H,
        rekap.I,
        rekap.S,
        rekap.A,
      ];
    });

    autoTable(doc, {
      startY: 60,
      head: [headRow],
      body: bodyRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [200, 200, 200] },
      margin: { left: 10, right: 10 },
    });

    const printedDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.setFontSize(10);
    doc.text(
      `Tangerang Selatan, ${printedDate}`,
      220,
      doc.lastAutoTable.finalY + 10
    );
    doc.text("Guru Mata Pelajaran", 240, doc.lastAutoTable.finalY + 25);

    setExportProgress?.("Menyimpan file PDF...");
    doc.save(`Rekap_Presensi_${info.namaMapel}_${info.namaKelas}.pdf`);
    setExportProgress?.(null);
  } catch (err) {
    setExportProgress?.(null);
    throw err;
  }
}
