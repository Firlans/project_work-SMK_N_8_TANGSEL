import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";

const hariMap = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

const JadwalSiswa = () => {
  const [jadwal, setJadwal] = useState([]);
  const [waktu, setWaktu] = useState([]);
  const [guruMap, setGuruMap] = useState({});
  const [mapelMap, setMapelMap] = useState({});
  const [guruMapelMap, setGuruMapelMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        const idSiswa = profileRes.data.data.id;

        const [jadwalRes, waktuRes, guruRes, mapelRes] = await Promise.all([
          axiosClient.get(`/jadwal/siswa?id_siswa=${idSiswa}`),
          axiosClient.get("/waktu"),
          axiosClient.get("/guru"),
          axiosClient.get("/mata-pelajaran"),
        ]);

        console.log("Jadwal Response:", jadwalRes.data.data);
        console.log("Waktu Response:", waktuRes.data.data);
        console.log("Guru Response:", guruRes.data.data);
        console.log("Mapel Response:", mapelRes.data.data);

        const waktuSorted = waktuRes.data.data.sort((a, b) => a.id - b.id);

        const guruLookup = {};
        guruRes.data.data.forEach((g) => {
          guruLookup[g.id] = g.nama;
        });

        const mapelLookup = {};
        mapelRes.data.data.forEach((m) => {
          mapelLookup[m.id] = m.nama_pelajaran;
        });

        const guruMapelLookup = {};
        guruRes.data.data.forEach((g) => {
          guruMapelLookup[g.id] = g.mata_pelajaran_id;
        });

        setWaktu(waktuSorted);
        setJadwal(jadwalRes.data.data);
        setGuruMap(guruLookup);
        setMapelMap(mapelLookup);
        setGuruMapelMap(guruMapelLookup);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data jadwal:", error);
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const getDataByHari = (hariId) => {
    const filtered = jadwal.filter((j) => j.id_hari === hariId);
    return waktu.map((w) => {
      const found = filtered.find((j) => j.id_waktu === w.id);
      return {
        waktu: `${w.jam_mulai.slice(0, 5)} - ${w.jam_selesai.slice(0, 5)}`,
        mapel: found ? mapelMap[guruMapelMap[found.id_guru]] ?? "-" : "-",
        guru: found ? guruMap[found.id_guru] : "-",
      };
    });
  };

  if (loading) return <p>Memuat jadwal...</p>;

  return (
    <div className="space-y-8">
      {Object.entries(hariMap).map(([hariId, namaHari]) => {
        const rows = getDataByHari(parseInt(hariId));
        return (
          <div key={hariId} className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4">{namaHari}</h3>
            {rows.length === 0 || rows.every((r) => r.mapel === "-") ? (
              <p className="text-gray-500">Belum ada jadwal.</p>
            ) : (
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Waktu</th>
                    <th className="p-2 border">Mata Pelajaran</th>
                    <th className="p-2 border">Guru</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="p-2 border">{row.waktu}</td>
                      <td className="p-2 border">{row.mapel}</td>
                      <td className="p-2 border">{row.guru}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default JadwalSiswa;
