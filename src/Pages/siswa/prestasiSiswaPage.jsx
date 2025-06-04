import PrestasiSiswa from "../../Components/Fragments/Siswa/PrestasiSiswa";
import SiswaLayout from "../../Components/Layouts/SiswaLayouts";

const PrestasiSiswaPage = () => {
  return (
    <SiswaLayout defaultActivePage="prestasi">
      <PrestasiSiswa />
    </SiswaLayout>
  );
};

export default PrestasiSiswaPage;
