import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";

const hariMap = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

const JadwalGuru = () => {
  const [jadwal, setJadwal] = useState([]);
  const [waktu, setWaktu] = useState([]);
  const [kelasMap, setKelasMap] = useState({});
  const [mapelMap, setMapelMap] = useState({});
  const [guruMapelMap, setGuruMapelMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        const idGuru = profileRes.data.data.id;

        const [jadwalRes, waktuRes, kelasRes, guruRes, mapelRes] =
          await Promise.all([
            axiosClient.get(`/jadwal/guru/${idGuru}`),
            axiosClient.get("/waktu"),
            axiosClient.get("/kelas"),
            axiosClient.get("/guru"),
            axiosClient.get("/mata-pelajaran"),
          ]);

        const waktuSorted = waktuRes.data.data.sort((a, b) => a.id - b.id);

        const kelasLookup = {};
        kelasRes.data.data.forEach((k) => {
          kelasLookup[k.id] = k.nama_kelas;
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
        setKelasMap(kelasLookup);
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
    return waktu
      .map((w) => {
        const found = filtered.find((j) => j.id_waktu === w.id);
        if (!found) return null;
        return {
          waktu: `${w.jam_mulai.slice(0, 5)} - ${w.jam_selesai.slice(0, 5)}`,
          kelas: kelasMap[found.id_kelas] ?? "-",
          mapel: mapelMap[guruMapelMap[found.id_guru]] ?? "-",
        };
      })
      .filter((r) => r !== null); // Hanya tampilkan jam yang ada isinya
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {Object.entries(hariMap).map(([hariId, namaHari]) => {
            const rows = getDataByHari(parseInt(hariId));
            if (rows.length === 0) return null;
            return (
              <div key={hariId} className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-4">{namaHari}</h3>
                <table className="w-full text-left border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Waktu</th>
                      <th className="p-2 border">Kelas</th>
                      <th className="p-2 border">Mata Pelajaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-2 border">{row.waktu}</td>
                        <td className="p-2 border">{row.kelas}</td>
                        <td className="p-2 border">{row.mapel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default JadwalGuru;
