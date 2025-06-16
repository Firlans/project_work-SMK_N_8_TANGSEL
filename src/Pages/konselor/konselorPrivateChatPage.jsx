import { useParams } from "react-router-dom";
import KonselorLayouts from "../../Components/Layouts/KonselorLayouts";
import Cookies from "js-cookie";
import ChatRoomDetail from "../../Components/Fragments/Chat/ChatRoomDetail";

const KonselorPrivateChatPage = () => {
  const { id } = useParams();
  const user = JSON.parse(Cookies.get("userPrivilege"));
  const userId = user.user_id || user.id;

  return (
    <KonselorLayouts defaultActivePage="konseling">
      <div className="p-4 max-w-4xl mx-auto">
        <ChatRoomDetail roomId={id} userId={userId} isPrivate={true} />
      </div>
    </KonselorLayouts>
  );
};

export default KonselorPrivateChatPage;
