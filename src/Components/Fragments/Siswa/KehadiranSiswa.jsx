import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
// import formatTanggal from "../../../utils/dateFormatter";

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
        // Ambil ID siswa
        const profileRes = await axiosClient.get("/profile");
        const idSiswa = profileRes.data.data.id;

        // Ambil presensi
        const presensiRes = await axiosClient.get(
          `/absen/siswa?id_siswa=${idSiswa}`
        );
        const presensiData = presensiRes.data.data;
        setPresensi(presensiData);

        // Ambil jadwal siswa
        const jadwalRes = await axiosClient.get(
          `/jadwal/siswa?id_siswa=${idSiswa}`
        );
        const jadwalMapById = {};
        jadwalRes.data.data.forEach((jadwal) => {
          jadwalMapById[jadwal.id] = jadwal;
        });
        setJadwalMap(jadwalMapById);

        // Ambil semua guru
        const guruRes = await axiosClient.get("/guru");
        const guruById = {};
        guruRes.data.data.forEach((guru) => {
          guruById[guru.id] = guru;
        });
        setGuruMap(guruById);

        // Ambil semua mata pelajaran
        const mapelRes = await axiosClient.get("/mata-pelajaran");
        const mapelById = {};
        mapelRes.data.data.forEach((mapel) => {
          mapelById[mapel.id] = mapel.nama_pelajaran;
        });
        setMapelMap(mapelById);

        // Buat daftar unik mata pelajaran dari jadwal yang digunakan presensi
        const mapelSet = new Set();
        presensiData.forEach((p) => {
          const jadwal = jadwalMapById[p.id_jadwal];
          const guru = guruById[jadwal?.id_guru];
          if (guru) mapelSet.add(guru.mata_pelajaran_id);
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
        const guru = guruMap[jadwal?.id_guru];
        return guru?.mata_pelajaran_id === parseInt(selectedMapel);
      })
    : presensi;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Presensi Siswa</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Filter Mapel:</label>
              <select
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
                className="form-select border rounded-lg px-3 py-1"
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

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Pertemuan</th>
                  <th className="px-4 py-2 text-left text-sm">Tanggal</th>
                  <th className="px-4 py-2 text-left text-sm">
                    Mata Pelajaran
                  </th>
                  <th className="px-4 py-2 text-left text-sm">Status</th>
                  <th className="px-4 py-2 text-left text-sm">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPresensi.length > 0 ? (
                  filteredPresensi.map((item) => {
                    const jadwal = jadwalMap[item.id_jadwal];
                    const guru = guruMap[jadwal?.id_guru];
                    const namaMapel = mapelMap[guru?.mata_pelajaran_id];

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2">{item.nama_pertemuan}</td>
                        <td className="px-4 py-2">{item.tanggal}</td>
                        <td className="px-4 py-2">
                          {namaMapel || "Tidak ditemukan"}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              item.status === "Hadir"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Izin"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.status === "Sakit"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{item.keterangan || "-"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      Belum ada data presensi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PresensiSiswa;
