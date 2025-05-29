import PresensiGuru from "../../Components/Fragments/Guru/KehadiranSiswaByGuru";
import GuruLayouts from "../../Components/Layouts/GuruLayouts";

const PresensiSiswaPage = () => {
  return (
    <GuruLayouts defaultActivePage="attendance">
      <PresensiGuru />
    </GuruLayouts>
  );
};

export default PresensiSiswaPage;
