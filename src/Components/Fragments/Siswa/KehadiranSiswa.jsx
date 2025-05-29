import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import { formatTanggal } from "../../../utils/dateFormatter";

const PresensiSiswa = () => {
  const [presensi, setPresensi] = useState([]);
  const [jadwalMap, setJadwalMap] = useState({});
  const [guruMap, setGuruMap] = useState({});
  const [mapelMap, setMapelMap] = useState({});
  const [selectedMapel, setSelectedMapel] = useState("");
  const [loading, setLoading] = useState(true);
  const [mataPelajaranList, setMataPelajaranList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        const idSiswa = profileRes.data.data.id;

        const [presensiRes, jadwalRes, guruRes, mapelRes] = await Promise.all([
          axiosClient.get(`/absen/siswa?id_siswa=${idSiswa}`),
          axiosClient.get(`/jadwal/siswa?id_siswa=${idSiswa}`),
          axiosClient.get("/guru"),
          axiosClient.get("/mata-pelajaran"),
        ]);

        const presensiData = presensiRes.data.data;
        const jadwalData = jadwalRes.data.data;
        const guruData = guruRes.data.data;
        const mapelData = mapelRes.data.data;

        const jadwalById = {};
        const guruById = {};
        const mapelById = {};

        jadwalData.forEach((j) => (jadwalById[j.id] = j));
        guruData.forEach((g) => (guruById[g.id] = g));
        mapelData.forEach((m) => (mapelById[m.id] = m.nama_pelajaran));

        setPresensi(presensiData);
        setJadwalMap(jadwalById);
        setGuruMap(guruById);
        setMapelMap(mapelById);

        // Ambil ID mapel unik dari jadwal yang digunakan di presensi
        const mapelSet = new Set();
        presensiData.forEach((p) => {
          const jadwal = jadwalById[p.id_jadwal];
          if (jadwal?.id_mata_pelajaran) {
            mapelSet.add(jadwal.id_mata_pelajaran);
          }
        });

        const mapelList = Array.from(mapelSet).map((id) => ({
          id,
          nama: mapelById[id] || "Tidak diketahui",
        }));

        setMataPelajaranList(mapelList);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data presensi:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPresensi = selectedMapel
    ? presensi.filter((item) => {
        const jadwal = jadwalMap[item.id_jadwal];
        return jadwal?.id_mata_pelajaran === parseInt(selectedMapel);
      })
    : presensi;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Presensi Siswa
            </h2>
            <div className="w-full sm:w-auto flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">
                Filter Mapel:
              </label>
              <select
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
                className="w-full sm:w-auto form-select border rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="">Semua Mata Pelajaran</option>
                {mataPelajaranList.map((mapel) => (
                  <option key={mapel.id} value={mapel.id}>
                    {mapel.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                      Mata Pelajaran
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                      Tanggal
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                      Pertemuan
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredPresensi.length > 0 ? (
                    filteredPresensi.map((item) => {
                      const jadwal = jadwalMap[item.id_jadwal];
                      const namaMapel =
                        mapelMap[jadwal?.id_mata_pelajaran] ||
                        "Tidak ditemukan";
                      const status = item.status?.toLowerCase();

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                            {namaMapel}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap">
                            {formatTanggal(item.tanggal)}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                            {item.nama_pertemuan}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                                status === "hadir"
                                  ? "bg-green-100 text-green-800"
                                  : status === "izin"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : status === "sakit"
                                  ? "bg-blue-100 text-blue-800"
                                  : status === "alpha"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.status
                                ? item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)
                                : "-"}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                            {item.keterangan || "-"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-3 sm:px-4 py-4 text-center text-gray-500 text-xs sm:text-sm"
                      >
                        Belum ada data presensi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresensiSiswa;
