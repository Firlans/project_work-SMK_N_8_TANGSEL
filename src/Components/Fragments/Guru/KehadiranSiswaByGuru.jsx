import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import PresensiList from "../JadwalMapel/Presensi";

const PresensiGuru = () => {
  const [jadwalList, setJadwalList] = useState([]);
  const [pertemuanList, setPertemuanList] = useState([]);
  const [selectedJadwalId, setSelectedJadwalId] = useState(null);
  const [selectedPertemuanId, setSelectedPertemuanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kelasMap, setKelasMap] = useState({});
  const [mapelMap, setMapelMap] = useState({});
  const [waktuMap, setWaktuMap] = useState({});

  const hariMap = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
  };

  // Fetch jadwal guru yang login
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axiosClient.get("/profile");
        const guruId = profileRes.data.data.id;

        // Get guru detail first to get mata_pelajaran_id
        const guruRes = await axiosClient.get(`/guru/${guruId}`);
        const guruMapelId = guruRes.data.data.mata_pelajaran_id;

        // Then fetch other data
        const [jadwalRes, kelasRes, mapelRes, waktuRes] = await Promise.all([
          axiosClient.get(`/jadwal/guru/${guruId}`),
          axiosClient.get("/kelas"),
          axiosClient.get("/mata-pelajaran"),
          axiosClient.get("/waktu"),
        ]);

        // Buat mapping untuk kelas
        const kelasLookup = {};
        kelasRes.data.data.forEach((k) => {
          kelasLookup[k.id] = k.nama_kelas;
        });

        // Buat mapping untuk mapel
        const mapelLookup = {};
        mapelRes.data.data.forEach((m) => {
          mapelLookup[m.id] = m.nama_pelajaran;
        });

        // Buat mapping untuk waktu
        const waktuLookup = {};
        waktuRes.data.data.forEach((w) => {
          waktuLookup[w.id] = `${w.jam_mulai.slice(
            0,
            5
          )} - ${w.jam_selesai.slice(0, 5)}`;
        });

        // Modify jadwal data to include mapel_id
        const jadwalWithMapel = jadwalRes.data.data.map((jadwal) => ({
          ...jadwal,
          id_mapel: guruMapelId, // Add mata pelajaran ID from guru data
        }));

        setJadwalList(jadwalWithMapel);
        setKelasMap(kelasLookup);
        setMapelMap(mapelLookup);
        setWaktuMap(waktuLookup);

        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchPertemuan = async (jadwalId) => {
    try {
      const res = await axiosClient.get(`/pertemuan/jadwal/${jadwalId}`);
      console.log("Pertemuan:", res.data.data);
      setPertemuanList(res.data.data);
      setSelectedJadwalId(jadwalId);
    } catch (error) {
      console.error("Gagal mengambil pertemuan:", error);
    }
  };

  const handleBack = () => {
    if (selectedPertemuanId) {
      setSelectedPertemuanId(null);
    } else if (selectedJadwalId) {
      setSelectedJadwalId(null);
      setPertemuanList([]);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Presensi Siswa
        </h1>
        {(selectedJadwalId || selectedPertemuanId) && (
          <button
            onClick={handleBack}
            className="w-full sm:w-auto bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Kembali
          </button>
        )}
      </div>

      {/* Tahap 1: List Jadwal */}
      {!selectedJadwalId && (
        <div className="grid grid-cols-1 gap-4">
          {jadwalList.map((jadwal) => (
            <div
              key={jadwal.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
            >
              <div className="w-full sm:w-auto">
                <h3 className="font-medium text-base sm:text-lg mb-1">
                  {mapelMap[jadwal.id_mapel] || "Mapel tidak ditemukan"}
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    {kelasMap[jadwal.id_kelas] || "Kelas tidak ditemukan"}
                  </span>
                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {hariMap[jadwal.id_hari]}
                  </span>
                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {waktuMap[jadwal.id_waktu] || "Waktu tidak ditemukan"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => fetchPertemuan(jadwal.id)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>Pilih</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tahap 2: List Pertemuan */}
      {selectedJadwalId && !selectedPertemuanId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pertemuanList.map((pertemuan) => (
            <div
              key={pertemuan.id}
              className="flex flex-col p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 mb-4">
                <h3 className="font-medium text-lg mb-2">
                  {pertemuan.nama_pertemuan}
                </h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(pertemuan.tanggal).toLocaleDateString("id-ID")}
                </p>
              </div>
              <button
                onClick={() => setSelectedPertemuanId(pertemuan.id)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>Pilih</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tahap 3: List Presensi */}
      {selectedPertemuanId && (
        <div className="w-full overflow-x-auto">
          <PresensiList idPertemuan={selectedPertemuanId} />
        </div>
      )}
    </div>
  );
};

export default PresensiGuru;
