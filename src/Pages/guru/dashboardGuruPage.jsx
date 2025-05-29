import ProfileGuru from "../../Components/Fragments/Guru/ProfileGuru";
import GuruLayouts from "../../Components/Layouts/GuruLayouts";

const DashboardGuruPage = () => {
  return (
    <GuruLayouts defaultActivePage="profile">
      <ProfileGuru />
    </GuruLayouts>
  );
};

export default DashboardGuruPage;
