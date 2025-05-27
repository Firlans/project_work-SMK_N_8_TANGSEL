import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataAdmin from "../../Components/Fragments/Admin/Data Admin/DataAdmin";

const DataAdminPage = () => {
  return (
    <AdminLayout defaultActivePage="admins">
      <DataAdmin />
    </AdminLayout>
  );
};

export default DataAdminPage;
