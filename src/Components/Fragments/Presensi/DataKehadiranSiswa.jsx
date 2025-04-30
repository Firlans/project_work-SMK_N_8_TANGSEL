import { useState } from "react";
import KelasTable from "./Kelas";
import SiswaTable from "./Siswa";
import MapelTable from "./Mapel";
import PresensiTable from "./Presensi";

const DataKehadiranSiswa = () => {
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [selectedMapel, setSelectedMapel] = useState(null);

  const handleBack = () => {
    if (selectedMapel) setSelectedMapel(null);
    else if (selectedSiswa) setSelectedSiswa(null);
    else if (selectedKelas) setSelectedKelas(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Data Kehadiran Siswa</h2>
        {(selectedKelas || selectedSiswa || selectedMapel) && (
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Kembali
          </button>
        )}
      </div>

      {!selectedKelas && <KelasTable onSelectKelas={setSelectedKelas} />}

      {selectedKelas && !selectedSiswa && (
        <SiswaTable kelasId={selectedKelas} onSelectSiswa={setSelectedSiswa} />
      )}

      {selectedSiswa && !selectedMapel && (
        <MapelTable onSelectMapel={setSelectedMapel} />
      )}

      {selectedMapel && (
        <PresensiTable siswaId={selectedSiswa} mapelId={selectedMapel} />
      )}
    </div>
  );
};

export default DataKehadiranSiswa;
