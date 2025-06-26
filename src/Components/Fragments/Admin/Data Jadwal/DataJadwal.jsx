// DataJadwal.jsx

import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import FormJadwal from "./FormJadwal";
import { FaEye, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { PiExportBold } from "react-icons/pi";

const DataJadwal = () => {
  const [jadwal, setJadwal] = useState([]);
  const [groupedJadwal, setGroupedJadwal] = useState([]);
  const [waktu, setWaktu] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [guru, setGuru] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPrivilege, setUserPrivilege] = useState(null);
  const navigate = useNavigate();

  const hariMap = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
  };

  const groupJadwalBySesi = (jadwalList) => {
    const grouped = {};
    jadwalList.forEach((j) => {
      const key = `${j.id_kelas}-${j.id_guru}-${j.id_hari}-${j.id_mata_pelajaran}`;
      if (!grouped[key]) {
        grouped[key] = {
          id_kelas: j.id_kelas,
          id_guru: j.id_guru,
          id_hari: j.id_hari,
          id_mata_pelajaran: j.id_mata_pelajaran,
          waktuList: [],
          semuaJadwalId: [],
          jadwalUtama: j,
        };
      }
      grouped[key].waktuList.push(j.id_waktu);
      grouped[key].semuaJadwalId.push(j.id);
    });
    return Object.values(grouped);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resJadwal, resWaktu, resKelas, resGuru, resMapel] =
        await Promise.all([
          axiosClient.get("/jadwal"),
          axiosClient.get("/waktu"),
          axiosClient.get("/kelas"),
          axiosClient.get("/guru"),
          axiosClient.get("/mata-pelajaran"),
        ]);

      setJadwal(resJadwal.data.data);

      setGroupedJadwal(groupJadwalBySesi(resJadwal.data.data));
      console.log(
        JSON.stringify(groupJadwalBySesi(resJadwal.data.data), null, 2)
      );

      setWaktu(resWaktu.data.data);
      setKelas(
        resKelas.data.data.sort((a, b) =>
          a.nama_kelas.localeCompare(b.nama_kelas)
        )
      );
      setGuru(resGuru.data.data);
      setMapel(resMapel.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const privilegeData = Cookies.get("userPrivilege");
    if (privilegeData) {
      try {
        setUserPrivilege(JSON.parse(privilegeData));
      } catch (error) {
        console.error("Error parsing privilege:", error);
      }
    }
    fetchData();
  }, []);

  const isSuperAdmin = () => {
    if (!userPrivilege) return false;
    return userPrivilege.is_superadmin === 1;
  };

  const getKodeGuruMapel = (slot) => {
    const guruData = guru.find((g) => g.id === slot.id_guru);
    const mapelData = mapel.find((m) => m.id === slot.id_mata_pelajaran);
    if (!guruData || !mapelData) return "-";
    const guruIndex = guru.indexOf(guruData) + 1;
    const mapelIndex = mapel.indexOf(mapelData) + 1;
    return `G${guruIndex}-M${mapelIndex}`;
  };

  const handleEdit = (data) => {
    setSelectedData(data);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
    try {
      await axiosClient.delete(`/jadwal/${id}`);
      setJadwal((prev) => prev.filter((j) => j.id !== id));
      setGroupedJadwal(groupJadwalBySesi(jadwal.filter((j) => j.id !== id)));
    } catch (error) {
      console.error("Gagal menghapus jadwal:", error);
    }
  };

  const handleLihatPertemuan = (jadwalId) => {
    navigate(`/dashboard-admin/data-jadwal/${jadwalId}/pertemuan`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF("landscape", "mm", "a4");
    const logoPath = "/images/logo-smkn8tangsel.png";

    // 🖼️ Logo dan Header
    doc.addImage(logoPath, "PNG", 14, 10, 25, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SMK NEGERI 8 KOTA TANGERANG SELATAN", 148, 15, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text("JADWAL MATA PELAJARAN & PRESENSI", 148, 22, { align: "center" });

    // 🔠 Header tabel: [Hari / Waktu, Kelas1, Kelas2, ...]
    const tableHeaders = ["Hari / Waktu", ...kelas.map((k) => k.nama_kelas)];

    const body = [];

    Object.entries(hariMap).forEach(([idHari, namaHari]) => {
      waktu.forEach((w) => {
        const row = [];

        // Kolom 1: Hari + Jam
        row.push(
          `${namaHari}\n${w.jam_mulai.slice(0, 5)} - ${w.jam_selesai.slice(
            0,
            5
          )}`
        );

        // Kolom per kelas
        kelas.forEach((k) => {
          const matchGroup = groupedJadwal.find(
            (g) =>
              g.id_kelas === k.id &&
              g.id_hari === Number(idHari) &&
              g.waktuList.includes(w.id)
          );

          if (!matchGroup) {
            row.push("-");
            return;
          }

          const slot = jadwal.find(
            (j) =>
              matchGroup.semuaJadwalId.includes(j.id) && j.id_waktu === w.id
          );

          const guruData = guru.find((g) => g.id === slot?.id_guru);
          const mapelData = mapel.find((m) => m.id === slot?.id_mata_pelajaran);

          const guruIndex = guru.indexOf(guruData) + 1;
          const mapelIndex = mapel.indexOf(mapelData) + 1;

          const kode = `G${guruIndex}-M${mapelIndex}`;
          row.push(kode);
        });

        body.push(row);
      });
    });

    // 🖨️ Render tabel
    autoTable(doc, {
      startY: 40,
      head: [tableHeaders],
      body,
      styles: { fontSize: 7, valign: "middle", cellPadding: 2 },
      headStyles: {
        fillColor: [220, 220, 220],
        halign: "center",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 40 },
      },
      theme: "grid",
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    // 📘 LEGEND GURU
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Kode Guru:", 14, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    const guruList = guru.map((g, i) => `G${i + 1}: ${g.nama}`);
    const guruChunks = chunkArray(guruList, 4); // 4 kolom per baris

    guruChunks.forEach((row) => {
      doc.text(row, 14, currentY);
      currentY += 6;
    });

    currentY += 4;

    // 📗 LEGEND MAPEL
    doc.setFont("helvetica", "bold");
    doc.text("Kode Mata Pelajaran:", 14, currentY);
    currentY += 6;

    doc.setFont("helvetica", "normal");
    const mapelList = mapel.map((m, i) => `M${i + 1}: ${m.nama_pelajaran}`);
    const mapelChunks = chunkArray(mapelList, 4); // 4 kolom per baris

    mapelChunks.forEach((row) => {
      doc.text(row, 14, currentY);
      currentY += 6;
    });

    // 🕘 Footer tanggal
    const tanggal = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.setFontSize(9);
    doc.text(`Dicetak: ${tanggal}`, 14, currentY + 10);

    // 💾 Save
    doc.save("jadwal-semua-kelas.pdf");
  };

  // 🔧 Helper
  function chunkArray(arr, chunkSize) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks.map((c) => c.join("    "));
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-2 sm:p-4 md:p-6 rounded-xl shadow-sm transition-colors duration-300 max-w-screen-xl mx-auto mb-8">
      {loading ? (
        <LoadingSpinner text={"Memuat data jadwal..."} />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 transition-all duration-300">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              Jadwal Mata Pelajaran & Presensi
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {!isSuperAdmin() && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-3 py-2 sm:px-4 flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto text-sm sm:text-base"
                >
                  <FaPlus className="w-4 h-4" />
                  Tambah Jadwal
                </button>
              )}
              <button
                onClick={handleExportPDF}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 text-sm font-semibold transition-colors duration-300"
              >
                <PiExportBold size={18} /> Export Jadwal
              </button>
            </div>
          </div>

          {/* Tabel */}
          <div className="w-full overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300 text-xs sm:text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                  <tr>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      Hari/Waktu
                    </th>
                    {kelas.map((k) => (
                      <th
                        key={k.id}
                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 whitespace-nowrap"
                      >
                        {k.nama_kelas}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                  {Object.entries(hariMap).map(([idHari, namaHari]) =>
                    waktu.map((w) => {
                      return (
                        <tr
                          key={`${idHari}-${w.id}`}
                          className="transition-colors duration-300"
                        >
                          <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-center whitespace-nowrap text-gray-700 dark:text-gray-200">
                            <span className="font-medium text-xs sm:text-sm">
                              {namaHari}
                            </span>
                            <br />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {w.jam_mulai.slice(0, 5)} -{" "}
                              {w.jam_selesai.slice(0, 5)}
                            </span>
                          </td>

                          {kelas.map((k) => {
                            // ...existing code...
                            const matchGroup = groupedJadwal.find(
                              (g) =>
                                g.id_kelas === k.id &&
                                g.id_hari === Number(idHari) &&
                                g.waktuList.includes(w.id)
                            );

                            if (!matchGroup) {
                              return (
                                <td
                                  key={k.id}
                                  className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-center text-gray-400"
                                >
                                  -
                                </td>
                              );
                            }

                            const slot = jadwal.find(
                              (j) =>
                                j.id ===
                                matchGroup.semuaJadwalId.find((idJ) => {
                                  const jadwalItem = jadwal.find(
                                    (x) => x.id === idJ
                                  );
                                  return jadwalItem?.id_waktu === w.id;
                                })
                            );

                            return (
                              <td
                                key={k.id}
                                className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-center relative group text-gray-800 dark:text-gray-100 transition-colors duration-300"
                              >
                                <div className="text-xs sm:text-sm">
                                  {getKodeGuruMapel(slot)}
                                  <div className="hidden group-hover:flex gap-2 justify-center mt-1">
                                    {!isSuperAdmin() && (
                                      <>
                                        <button
                                          className="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                                          onClick={() =>
                                            handleLihatPertemuan(
                                              matchGroup.jadwalUtama.id
                                            )
                                          }
                                        >
                                          <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleEdit(slot)}
                                          className="p-1 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                                        >
                                          <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDelete(slot.id)}
                                          className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                        >
                                          <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg transition-colors duration-300">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">
                  Kode Guru:
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-2 text-gray-700 dark:text-gray-200">
                  {guru.map((g, i) => (
                    <div key={g.id} className="text-xs sm:text-sm">
                      G{i + 1}: {g.nama}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg transition-colors duration-300">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-white">
                  Kode Mata Pelajaran:
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-2 text-gray-700 dark:text-gray-200">
                  {mapel.map((m, i) => (
                    <div key={m.id} className="text-xs sm:text-sm">
                      M{i + 1}: {m.nama_pelajaran}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Form */}
          {showForm && (
            <FormJadwal
              isOpen={showForm}
              onClose={() => {
                setShowForm(false);
                setSelectedData(null);
              }}
              data={selectedData}
              waktu={waktu}
              kelas={kelas}
              guru={guru}
              jadwal={jadwal}
              mapel={mapel}
              onSuccess={(newData) => {
                const isEdit = !!selectedData;

                if (Array.isArray(newData)) {
                  // handle banyak data baru (create multiple waktu)
                  const updated = [...jadwal, ...newData];
                  setJadwal(updated);
                  setGroupedJadwal(groupJadwalBySesi(updated));
                } else {
                  if (isEdit) {
                    const updated = jadwal.map((j) =>
                      j.id === newData.id ? newData : j
                    );
                    setJadwal(updated);
                    setGroupedJadwal(groupJadwalBySesi(updated));
                  } else {
                    const updated = [...jadwal, newData];
                    setJadwal(updated);
                    setGroupedJadwal(groupJadwalBySesi(updated));
                  }
                }

                setShowForm(false);
                setSelectedData(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DataJadwal;
