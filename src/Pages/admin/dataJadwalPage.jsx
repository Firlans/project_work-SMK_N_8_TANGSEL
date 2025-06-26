import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataJadwal from "../../Components/Fragments/Admin/Data Jadwal/DataJadwal";

const DataJadwalPage = () => {
  return (
    <AdminLayout defaultActivePage="schedule">
      <DataJadwal />
    </AdminLayout>
  );
};

export default DataJadwalPage;
