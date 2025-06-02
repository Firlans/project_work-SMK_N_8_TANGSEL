import PertemuanList from "../../Components/Fragments/PertemuanList"
import GuruLayouts from "../../Components/Layouts/GuruLayouts"

const PertemuanGuruPage = () => {
    return (
        <GuruLayouts defaultActivePage="schedule">
            <PertemuanList />
        </GuruLayouts>
    )
}

export default PertemuanGuruPage