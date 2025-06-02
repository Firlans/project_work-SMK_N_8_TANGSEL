import PelanggaranGuru from "../../Components/Fragments/Guru/PelanggaranGuru";
import GuruLayouts from "../../Components/Layouts/GuruLayouts";

const PelaporanGuruPage = () => {
  return (
    <GuruLayouts defaultActivePage="pelaporan">
      <PelanggaranGuru />
    </GuruLayouts>
  );
};

export default PelaporanGuruPage;
