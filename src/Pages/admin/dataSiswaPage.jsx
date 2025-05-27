import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataSiswa from "../../Components/Fragments/Admin/Data Siswa/DataSiswa";

const DataSiswaPage = () => {
  return (
    <AdminLayout defaultActivePage="students">
      <DataSiswa />
    </AdminLayout>
  );
};

export default DataSiswaPage;
