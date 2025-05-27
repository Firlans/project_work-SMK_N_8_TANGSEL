import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataMapel from "../../Components/Fragments/Admin/Data Mapel/DataMapel";

const DataMapelPage = () => {
  return (
    <AdminLayout defaultActivePage="subjects">
      <DataMapel />
    </AdminLayout>
  );
};

export default DataMapelPage;
