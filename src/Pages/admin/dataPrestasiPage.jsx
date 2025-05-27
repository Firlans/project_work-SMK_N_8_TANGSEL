import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataPrestasi from "../../Components/Fragments/Admin/Data Prestasi/DataPrestasi";

const DataPrestasiPage = () => {
  return (
    <AdminLayout defaultActivePage="achievement">
      <DataPrestasi />
    </AdminLayout>
  );
};

export default DataPrestasiPage;
