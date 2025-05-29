import PresensiSiswa from "../../Components/Fragments/Siswa/KehadiranSiswa";
import SiswaLayout from "../../Components/Layouts/SiswaLayouts";

const KehadiranSiswaPage = () => {
  return (
    <SiswaLayout defaultActivePage="kehadiran">
      <PresensiSiswa />
    </SiswaLayout>
  );
};

export default KehadiranSiswaPage;
