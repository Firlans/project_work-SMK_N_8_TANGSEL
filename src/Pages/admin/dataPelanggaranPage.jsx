import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataPelanggaran from "../../Components/Fragments/Admin/Data Pelanggaran/DataPelanggaran";

const DataPelanggaranPage = () => {
  return (
    <AdminLayout defaultActivePage="violations">
      <DataPelanggaran />
    </AdminLayout>
  );
};

export default DataPelanggaranPage;
