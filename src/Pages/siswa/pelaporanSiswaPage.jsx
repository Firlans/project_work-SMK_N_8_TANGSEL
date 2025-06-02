import PelanggaranSiswa from "../../Components/Fragments/Siswa/PelanggaranSiswa"
import SiswaLayout from "../../Components/Layouts/SiswaLayouts"

const PelaporanSiswaPage = () => {
    return (
        <SiswaLayout defaultActivePage="pelaporan">
            <PelanggaranSiswa/>
        </SiswaLayout>
    )
}

export default PelaporanSiswaPage