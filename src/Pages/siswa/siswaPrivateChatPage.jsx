import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import SiswaLayout from "../../Components/Layouts/SiswaLayouts";
import ChatRoomDetail from "../../Components/Fragments/Chat/ChatRoomDetail";

const SiswaPrivateChatPage = () => {
  const { id } = useParams();
  const user = JSON.parse(Cookies.get("userPrivilege"));
  const userId = user.user_id || user.id;

  return (
    <SiswaLayout defaultActivePage="bk">
      <div className="p-4 max-w-4xl mx-auto">
        <ChatRoomDetail roomId={id} userId={userId} isPrivate={true} />
      </div>
    </SiswaLayout>
  );
};

export default SiswaPrivateChatPage;
