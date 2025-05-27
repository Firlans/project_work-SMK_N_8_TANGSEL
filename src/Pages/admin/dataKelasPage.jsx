import AdminLayout from "../../Components/Layouts/AdminLayout";
import DataKelas from "../../Components/Fragments/Admin/Data Kelas/DataKelas";

const DataKelasPage = () => {
    return (
        <AdminLayout defaultActivePage="classes">
            <DataKelas />
        </AdminLayout>
    );
};

export default DataKelasPage;