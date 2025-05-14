import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import FormJadwal from "./FormJadwal";
import PertemuanList from "./Pertemuan";
import PresensiList from "./Presensi";
import { FaEye, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

const JadwalMapel = () => {
  const [jadwal, setJadwal] = useState([]);
  const [waktu, setWaktu] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [guru, setGuru] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pertemuan, setPertemuan] = useState([]);
  const [selectedJadwalId, setSelectedJadwalId] = useState(null);
  const [selectedPertemuanId, setSelectedPertemuanId] = useState(null);

  const hariMap = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resJadwal, resWaktu, resKelas, resGuru, resMapel] =
          await Promise.all([
            axiosClient.get("/jadwal"),
            axiosClient.get("/waktu"),
            axiosClient.get("/kelas"),
            axiosClient.get("/guru"),
            axiosClient.get("/mata-pelajaran"),
          ]);

        setJadwal(resJadwal.data.data);
        setWaktu(resWaktu.data.data);
        setKelas(
          resKelas.data.data.sort((a, b) =>
            a.nama_kelas.localeCompare(b.nama_kelas)
          )
        );
        setGuru(resGuru.data.data);
        setMapel(resMapel.data.data);
        setLoading(false);
        console.log("Data jadwal:", resJadwal.data.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getKodeGuruMapel = (guruId) => {
    const guruData = guru.find((g) => g.id === guruId);
    if (!guruData) return "-";

    const mapelData = mapel.find((m) => m.id === guruData.mata_pelajaran_id);
    if (!mapelData) return "-";

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
    } catch (error) {
      console.error("Gagal menghapus jadwal:", error);
    }
  };

  const handleFetchPertemuan = async (jadwalId) => {
    try {
      const res = await axiosClient.get(`/pertemuan/jadwal/${jadwalId}`);
      setPertemuan(res.data.data);
      setSelectedJadwalId(jadwalId);
      console.log("Pertemuan:", res.data.data);
    } catch (err) {
      console.error("Gagal mengambil pertemuan:", err);
    }
  };

  const handleBack = () => {
    if (selectedPertemuanId) setSelectedPertemuanId(null);
    else if (selectedJadwalId) {
      setSelectedJadwalId(null);
      setPertemuan([]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Jadwal Mata Pelajaran & Presensi
            </h1>
            {(selectedJadwalId || selectedPertemuanId) && (
              <button
                onClick={handleBack}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Kembali
              </button>
            )}
            {!selectedJadwalId && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FaPlus /> Tambah Jadwal
              </button>
            )}
          </div>

          {/* ======================== JADWAL TABEL ======================== */}
          {!selectedJadwalId && !selectedPertemuanId && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3">Hari/Waktu</th>
                    {kelas.map((k) => (
                      <th key={k.id} className="px-6 py-3">
                        {k.nama_kelas}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(hariMap).map(([idHari, namaHari]) =>
                    waktu.map((w) => (
                      <tr key={`${idHari}-${w.id}`}>
                        <td className="px-6 py-4 text-center">
                          {namaHari}
                          <br />
                          <span className="text-sm text-gray-500">
                            {w.jam_mulai.slice(0, 5)} -{" "}
                            {w.jam_selesai.slice(0, 5)}
                          </span>
                        </td>
                        {kelas.map((k) => {
                          const slot = jadwal.find(
                            (j) =>
                              j.id_hari === Number(idHari) &&
                              j.id_waktu === w.id &&
                              j.id_kelas === k.id
                          );

                          return (
                            <td
                              key={k.id}
                              className="px-6 py-4 text-center relative group"
                            >
                              {slot ? (
                                <>
                                  {getKodeGuruMapel(slot.id_guru)}
                                  <div className="hidden group-hover:flex gap-2 justify-center mt-1">
                                    <button
                                      className="text-blue-500 hover:text-blue-700"
                                      onClick={() =>
                                        handleFetchPertemuan(slot.id)
                                      }
                                    >
                                      <FaEye />
                                    </button>
                                    <button
                                      onClick={() => handleEdit(slot)}
                                      className="text-yellow-500 hover:text-yellow-700"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(slot.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                "-"
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Kode Guru:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {guru.map((g, i) => (
                      <div key={g.id} className="text-sm">
                        G{i + 1}: {g.nama}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Kode Mata Pelajaran:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {mapel.map((m, i) => (
                      <div key={m.id} className="text-sm">
                        M{i + 1}: {m.nama_pelajaran}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedJadwalId && !selectedPertemuanId && (
            <PertemuanList
              data={pertemuan}
              onClickKehadiran={(id) => setSelectedPertemuanId(id)}
              idJadwal={selectedJadwalId}
              onRefresh={() => handleFetchPertemuan(selectedJadwalId)}
            />
          )}

          {selectedPertemuanId && (
            <PresensiList idPertemuan={selectedPertemuanId} />
          )}

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
              onSuccess={(newData) => {
                if (selectedData) {
                  setJadwal((prev) =>
                    prev.map((j) => (j.id === newData.id ? newData : j))
                  );
                } else {
                  setJadwal((prev) => [...prev, newData]);
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

export default JadwalMapel;
