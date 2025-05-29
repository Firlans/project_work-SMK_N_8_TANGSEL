import DataPelanggaran from "../../Components/Fragments/Admin/Data Pelanggaran/DataPelanggaran";
import GuruLayouts from "../../Components/Layouts/GuruLayouts";

const PelaporanGuruPage = () => {
    return (
        <GuruLayouts defaultActivePage="pelaporan">
            <DataPelanggaran />
        </GuruLayouts>
    );
};

export default PelaporanGuruPage;