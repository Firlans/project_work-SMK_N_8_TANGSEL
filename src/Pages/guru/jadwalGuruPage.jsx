import JadwalGuru from "../../Components/Fragments/Guru/JadwalGuru";
import GuruLayouts from "../../Components/Layouts/GuruLayouts";

const JadwalGuruPage = () => {
  return (
    <GuruLayouts defaultActivePage="schedule">
      <JadwalGuru />
    </GuruLayouts>
  );
};

export default JadwalGuruPage;
