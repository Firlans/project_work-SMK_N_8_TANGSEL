import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import FormJadwal from "./FormJadwal";
import { FaEye, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const DataJadwal = () => {
  const [jadwal, setJadwal] = useState([]);
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

  useEffect(() => {
    // Ambil dan parse privilege dari cookies
    const privilegeData = Cookies.get("userPrivilege");
    console.log("Cookie privilege data:", privilegeData);

    if (privilegeData) {
      try {
        const parsedPrivilege = JSON.parse(privilegeData);
        console.log("Parsed privilege:", parsedPrivilege);
        setUserPrivilege(parsedPrivilege);
      } catch (error) {
        console.error("Error parsing privilege:", error);
      }
    }

    fetchData();
  }, []);

  const isSuperAdmin = () => {
    if (!userPrivilege) {
      console.log("userPrivilege is null");
      return false;
    }
    const isSuperAdmin = userPrivilege.is_superadmin === 1;
    return isSuperAdmin;
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
    } catch (error) {
      console.error("Gagal menghapus jadwal:", error);
    }
  };

  const handleLihatPertemuan = (jadwalId) => {
    navigate(`/dashboard-admin/data-jadwal/${jadwalId}/pertemuan`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 transition-all duration-300">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
              Jadwal Mata Pelajaran & Presensi
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {!isSuperAdmin() && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2  flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
                >
                  <FaPlus className="w-4 h-4" />
                  Tambah Jadwal
                </button>
              )}
            </div>
          </div>

          {/* Table Section */}
          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300">
                      Hari/Waktu
                    </th>
                    {kelas.map((k) => (
                      <th
                        key={k.id}
                        className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300"
                      >
                        {k.nama_kelas}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
                  {Object.entries(hariMap).map(([idHari, namaHari]) =>
                    waktu.map((w) => (
                      <tr
                        key={`${idHari}-${w.id}`}
                        className="transition-colors duration-300"
                      >
                        <td className="px-3 sm:px-6 py-2 sm:py-4 text-center whitespace-nowrap text-gray-700 dark:text-gray-200">
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
                          const slot = jadwal.find(
                            (j) =>
                              j.id_hari === Number(idHari) &&
                              j.id_waktu === w.id &&
                              j.id_kelas === k.id
                          );

                          return (
                            <td
                              key={k.id}
                              className="px-3 sm:px-6 py-2 sm:py-4 text-center relative group text-gray-800 dark:text-gray-100 transition-colors duration-300"
                            >
                              <div className="text-xs sm:text-sm">
                                {slot ? (
                                  <>
                                    {getKodeGuruMapel(slot)}
                                    <div className="hidden group-hover:flex gap-2 justify-center mt-1">
                                      {!isSuperAdmin() && (
                                        <>
                                          <button
                                            className="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                                            onClick={() =>
                                              handleLihatPertemuan(slot.id)
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
                                            onClick={() =>
                                              handleDelete(slot.id)
                                            }
                                            className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                          >
                                            <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Legend Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg transition-colors duration-300">
                <h3 className="text-sm sm:text-base font-semibold mb-3 text-gray-800 dark:text-white">
                  Kode Guru:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-200">
                  {guru.map((g, i) => (
                    <div key={g.id} className="text-xs sm:text-sm">
                      G{i + 1}: {g.nama}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg transition-colors duration-300">
                <h3 className="text-sm sm:text-base font-semibold mb-3 text-gray-800 dark:text-white">
                  Kode Mata Pelajaran:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-200">
                  {mapel.map((m, i) => (
                    <div key={m.id} className="text-xs sm:text-sm">
                      M{i + 1}: {m.nama_pelajaran}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Modal */}
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

export default DataJadwal;
