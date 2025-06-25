import PresensiList from "../../Components/Fragments/Presensi/PresensiList";
import GuruLayouts from "../../Components/Layouts/GuruLayouts";

const PresensiGuruPage = () => {
  return (
    <GuruLayouts defaultActivePage="attendance">
      <PresensiList />
    </GuruLayouts>
  );
};

export default PresensiGuruPage;
