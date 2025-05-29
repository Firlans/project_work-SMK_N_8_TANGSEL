import SiswaLayout from "../../Components/Layouts/SiswaLayouts";
import ProfileSiswa from "../../Components/Fragments/Siswa/ProfileSiswa";

const DashboardSiswaPage = () => {
  return (
    <SiswaLayout defaultActivePage="profile">
      <ProfileSiswa />
    </SiswaLayout>
  );
};

export default DashboardSiswaPage;
