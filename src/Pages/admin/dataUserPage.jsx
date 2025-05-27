import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataUser from "../../Components/Fragments/Data Users/DataUser";

const DataUserPage = () => {
  return (
    <AdminLayout defaultActivePage="users">
      <DataUser />
    </AdminLayout>
  );
};

export default DataUserPage;
