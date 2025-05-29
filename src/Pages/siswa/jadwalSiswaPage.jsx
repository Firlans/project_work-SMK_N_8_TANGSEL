import JadwalSiswa from "../../Components/Fragments/Siswa/JadwalSiswa";
import SiswaLayout from "../../Components/Layouts/SiswaLayouts";

const JadwalSiswaPage = () => {
  return (
    <SiswaLayout defaultActivePage="jadwal">
      <JadwalSiswa />
    </SiswaLayout>
  );
};

export default JadwalSiswaPage;