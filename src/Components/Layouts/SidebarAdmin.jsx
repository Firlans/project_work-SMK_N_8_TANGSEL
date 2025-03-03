import Sidebar from "../Fragments/Sidebar";
import DashboardContent from "./DashboardAdmin";

const AdminSidebar = () => {
  return (
    <div className="flex">
      <Sidebar />
      <DashboardContent />
    </div>
  );
};

export default AdminSidebar;
