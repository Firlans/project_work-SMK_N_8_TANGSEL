import { useParams } from "react-router-dom";
import ChatRoomDetail from "../../Components/Fragments/Chat/ChatRoomDetail";
import Cookies from "js-cookie";

const KonselorPublicChatPage = () => {
  const { id } = useParams();
  const user = JSON.parse(Cookies.get("userPrivilege"));
  const userId = user.user_id || user.id;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Chat Room</h1>
      <ChatRoomDetail roomId={id} userId={userId} />
    </div>
  );
};

export default KonselorPublicChatPage;
