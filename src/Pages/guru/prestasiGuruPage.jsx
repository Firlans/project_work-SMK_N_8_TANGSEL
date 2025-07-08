import DataPrestasi from "../../Components/Fragments/Admin/Data Prestasi/DataPrestasi";
import GuruLayouts from "../../Components/Layouts/GuruLayouts";

const PrestasiGuruPage = () => {
  return (
    <GuruLayouts defaultActivePage="prestasi">
      <DataPrestasi />
    </GuruLayouts>
  );
};

export default PrestasiGuruPage;
