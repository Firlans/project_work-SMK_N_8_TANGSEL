import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataPelanggaran from "../../Components/Fragments/Admin/Data Pelanggaran/DataPelanggaran";

const DataPelanggaranPage = () => {
  return (
    <AdminLayout defaultActivePage="violation">
      <DataPelanggaran />
    </AdminLayout>
  );
};

export default DataPelanggaranPage;
