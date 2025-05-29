import DataPelanggaran from "../../Components/Fragments/Admin/Data Pelanggaran/DataPelanggaran"
import SiswaLayout from "../../Components/Layouts/SiswaLayouts"

const PelaporanPage = () => {
    return (
        <SiswaLayout defaultActivePage="pelaporan">
            <DataPelanggaran />
        </SiswaLayout>
    )
}

export default PelaporanPage