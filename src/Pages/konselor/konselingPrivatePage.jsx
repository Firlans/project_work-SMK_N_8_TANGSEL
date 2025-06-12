import KonselingPrivate from "../../Components/Fragments/Konselor/KonselingPrivate";
import KonselorLayouts from "../../Components/Layouts/KonselorLayouts";

const KonselingPrivatePage = () => {
  return (
    <KonselorLayouts defaultActivePage="konseling">
      <KonselingPrivate />
    </KonselorLayouts>
  );
};

export default KonselingPrivatePage;
