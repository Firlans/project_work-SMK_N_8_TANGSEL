import { useState, useEffect, useMemo } from "react";
import axiosClient from "../../axiosClient";
import LoadingSpinner from "../Elements/Loading/LoadingSpinner";

const JadwalMapel = () => {
  const [jadwalList, setJadwalList] = useState([]);
  const [mataPelajaran, setMataPelajaran] = useState([]);
  const [kelasData, setKelasData] = useState({});
  const [guruData, setGuruData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterHari, setFilterHari] = useState("");
  const [filterKelas, setFilterKelas] = useState("");

  const hariMapping = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
    7: "Minggu",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Memulai fetch data jadwal...");

        // Fetch jadwal
        const jadwalResponse = await axiosClient.get("/jadwal");
        console.log("Data jadwal berhasil didapat:", jadwalResponse.data);
        const jadwalData = jadwalResponse.data.data;

        // Fetch mata pelajaran
        const mapelResponse = await axiosClient.get("/mata-pelajaran");
        const mapelData = mapelResponse.data.data;
        setMataPelajaran(mapelData);

        // Fetch guru untuk setiap mata pelajaran
        console.log("Memulai fetch data guru...");
        const uniqueMapelIds = [
          ...new Set(jadwalData.map((jadwal) => jadwal.id_mata_pelajaran)),
        ];
        const guruMap = {};

        for (const mapelId of uniqueMapelIds) {
          try {
            const guruResponse = await axiosClient.get(
              `/guru/mata-pelajaran/${mapelId}`
            );
            if (guruResponse.data.data && guruResponse.data.data.length > 0) {
              guruMap[mapelId] = guruResponse.data.data;
            } else {
              console.log(`Tidak ada guru untuk mapel ${mapelId}`);
              guruMap[mapelId] = [];
            }
          } catch (guruErr) {
            if (guruErr.response?.status === 404) {
              console.log(`Mata pelajaran ${mapelId} belum memiliki guru`);
              guruMap[mapelId] = [];
            } else {
              console.error(
                `Error fetching guru for mapel ${mapelId}:`,
                guruErr
              );
              guruMap[mapelId] = [];
            }
          }
        }

        console.log("Data guru berhasil didapat:", guruMap);
        setGuruData(guruMap);

        // Fetch kelas untuk setiap jadwal
        console.log("Memulai fetch data kelas...");
        const kelasPromises = jadwalData.map((jadwal) =>
          axiosClient.get(`/kelas/${jadwal.id_kelas}`)
        );
        const kelasResponses = await Promise.all(kelasPromises);
        const kelasMap = {};
        kelasResponses.forEach((response, index) => {
          kelasMap[jadwalData[index].id_kelas] = response.data.data;
        });
        console.log("Data kelas berhasil didapat:", kelasMap);
        setKelasData(kelasMap);

        setJadwalList(jadwalData);
        console.log("Semua data berhasil dimuat!");
      } catch (err) {
        console.error("Error saat fetch data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMataPelajaranNama = (id) => {
    const mapel = mataPelajaran.find((mp) => mp.id === id);
    return mapel ? mapel.nama_pelajaran : "Loading...";
  };

  const getGuruNama = (mapelId) => {
    const guruList = guruData[mapelId];
    if (!guruList || guruList.length === 0) {
      return "Belum ada guru pengajar";
    }
    // Jika ada multiple guru, tampilkan dengan koma
    return guruList.map((guru) => guru.nama).join(", ");
  };

  const filteredAndSortedJadwal = useMemo(() => {
    let result = [...jadwalList];

    // Apply filters
    if (filterHari) {
      result = result.filter(
        (jadwal) => jadwal.id_hari === parseInt(filterHari)
      );
    }
    if (filterKelas) {
      result = result.filter(
        (jadwal) => jadwal.id_kelas === parseInt(filterKelas)
      );
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let aValue =
          sortField === "mata_pelajaran"
            ? getMataPelajaranNama(a.id_mata_pelajaran)
            : a[sortField];
        let bValue =
          sortField === "mata_pelajaran"
            ? getMataPelajaranNama(b.id_mata_pelajaran)
            : b[sortField];

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });
    }

    return result;
  }, [
    jadwalList,
    filterHari,
    filterKelas,
    sortField,
    sortDirection,
    mataPelajaran,
  ]);

  const handleSort = (field) => {
    setSortField(field);
    setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex gap-4">
        <select
          className="p-2 border rounded"
          value={filterHari}
          onChange={(e) => setFilterHari(e.target.value)}
        >
          <option value="">Semua Hari</option>
          {Object.entries(hariMapping).map(([id, nama]) => (
            <option key={id} value={id}>
              {nama}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={filterKelas}
          onChange={(e) => setFilterKelas(e.target.value)}
        >
          <option value="">Semua Kelas</option>
          {Object.values(kelasData).map((kelas) => (
            <option key={kelas.id} value={kelas.id}>
              {kelas.nama_kelas}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="border p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("id_hari")}
            >
              Hari{" "}
              {sortField === "id_hari" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="border p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("mata_pelajaran")}
            >
              Mata Pelajaran{" "}
              {sortField === "mata_pelajaran" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="border p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("id_kelas")}
            >
              Kelas{" "}
              {sortField === "id_kelas" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th className="border p-2">Jam Mulai</th>
            <th className="border p-2">Jam Selesai</th>
            <th className="border p-2">Guru Pengajar</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedJadwal.map((jadwal) => (
            <tr key={jadwal.id}>
              <td className="border p-2">{hariMapping[jadwal.id_hari]}</td>
              <td className="border p-2">
                {getMataPelajaranNama(jadwal.id_mata_pelajaran)}
              </td>
              <td className="border p-2">
                {kelasData[jadwal.id_kelas]?.nama_kelas || "Loading..."}
              </td>
              <td className="border p-2">{jadwal.jam_mulai}</td>
              <td className="border p-2">{jadwal.jam_selesai}</td>
              <td className="border p-2">
                {getGuruNama(jadwal.id_mata_pelajaran)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JadwalMapel;
