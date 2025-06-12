import KonselingPublic from "../../Components/Fragments/Konselor/KonselingPublic";
import KonselorLayouts from "../../Components/Layouts/KonselorLayouts";

const KoselingPuclicPage = () => {
  return (
    <KonselorLayouts defaultActivePage="konseling">
      <KonselingPublic />
    </KonselorLayouts>
  );
};

export default KoselingPuclicPage;
