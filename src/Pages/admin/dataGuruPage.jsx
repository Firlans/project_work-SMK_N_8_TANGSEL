import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataGuru from "../../Components/Fragments/Admin/Data Guru/DataGuru";

const DataGuruPage = () => {
  return (
    <AdminLayout defaultActivePage="teachers">
      <DataGuru />
    </AdminLayout>
  );
};

export default DataGuruPage;
