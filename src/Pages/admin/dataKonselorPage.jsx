import AdminLayout from "../../Components/Layouts/AdminLayout"
import DataKonselor from "../../Components/Fragments/Admin/Data Konselor/DataKonselor"

const DataKonselorPage = () => {
    return (
        <AdminLayout defaultActivePage="counselor">
            <DataKonselor />
        </AdminLayout>
    )
}

export default DataKonselorPage