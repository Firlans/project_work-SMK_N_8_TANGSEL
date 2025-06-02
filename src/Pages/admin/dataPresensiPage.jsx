import PresensiList from "../../Components/Fragments/PresensiList";
import AdminLayout from "../../Components/Layouts/AdminLayout";

const DataPresensiPage = () => {
    return (
        <AdminLayout defaultActivePage="schedule">
            <PresensiList />
        </AdminLayout>
    );
}

export default DataPresensiPage