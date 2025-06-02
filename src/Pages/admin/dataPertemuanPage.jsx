import PertemuanList from "../../Components/Fragments/PertemuanList"
import AdminLayout from "../../Components/Layouts/AdminLayout"

const DataPertemuanPage = () => {
    return (
        <AdminLayout defaultActivePage="schedule">
            <PertemuanList />
        </AdminLayout>
    )
}

export default DataPertemuanPage