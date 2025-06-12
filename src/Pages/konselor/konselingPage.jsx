import Konseling from "../../Components/Fragments/Konselor/Konseling";
import KonselorLayouts from "../../Components/Layouts/KonselorLayouts";

const KonselingPage = () => {
  return (
    <KonselorLayouts defaultActivePage="konseling">
      <Konseling />
    </KonselorLayouts>
  );
};

export default KonselingPage;
