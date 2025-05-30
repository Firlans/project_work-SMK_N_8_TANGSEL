import DataPelanggaran from "../../Components/Fragments/Admin/Data Pelanggaran/DataPelanggaran"
import KonselorLayouts from "../../Components/Layouts/KonselorLayouts"

const PelaporanKonselorPage = () => {
    return (
        <KonselorLayouts defaultActivePage="pelaporan">
            <DataPelanggaran />
        </KonselorLayouts>
    )
}

export default PelaporanKonselorPage