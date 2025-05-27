import AdminLayout from "../../Components/Layouts/AdminLayout";
import ProfileAdmin from "../../Components/Fragments/ProfileAdmin";

const DashboardAdminPage = () => {
  return (
    <AdminLayout defaultActivePage="profile">
      <ProfileAdmin />
    </AdminLayout>
  );
};

export default DashboardAdminPage;
