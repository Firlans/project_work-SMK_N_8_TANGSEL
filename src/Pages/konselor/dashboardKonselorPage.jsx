import ProfileKonselor from "../../Components/Fragments/Konselor/ProfileKonselor";
import KonselorLayouts from "../../Components/Layouts/KonselorLayouts";

const DashboardKonselorPage = () => {
  return (
    <KonselorLayouts defaultActivePage="profile">
      <ProfileKonselor />
    </KonselorLayouts>
  );
};

export default DashboardKonselorPage;
