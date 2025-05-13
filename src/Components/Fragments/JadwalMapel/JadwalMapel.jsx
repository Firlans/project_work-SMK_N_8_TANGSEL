import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import FormJadwal from "./FormJadwal";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { FaEye } from "react-icons/fa6";

const JadwalMapel = () => {
  const [jadwal, setJadwal] = useState([]);
  const [waktu, setWaktu] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [guru, setGuru] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const sortedKelas = resKelas.data.data.sort((a, b) =>
          a.nama_kelas.localeCompare(b.nama_kelas)
        );

        setJadwal(resJadwal.data.data);
        setWaktu(resWaktu.data.data);
        setKelas(sortedKelas);
        setGuru(resGuru.data.data);
        setMapel(resMapel.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
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
      console.error("Failed to delete:", error);
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
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaPlus />
              Tambah Jadwal
            </button>
          </div>

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
                    <tr
                      key={`${idHari}-${w.id}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
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
                            className="px-6 py-4 whitespace-nowrap text-center relative group"
                          >
                            {slot ? (
                              <>
                                {getKodeGuruMapel(slot.id_guru)}
                                <div className="hidden group-hover:flex gap-2 justify-center">
                                  <button className="text-blue-500 hover:text-blue-700">
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
          </div>

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
              jadwal={jadwal} // Pass jadwal untuk validasi bentrok
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
