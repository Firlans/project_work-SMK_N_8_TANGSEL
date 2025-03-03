import ProfileInfo from "../Elements/Profile_Info/Index";
import SidebarItem from "../Elements/Sidebar_Items/Index";

const Sidebar = () => {
  return (
    <div className="bg-gray-100 w-64 h-screen p-4">
      <ProfileInfo name="Admin SMK 8" id="12345678" />
      <div className="mt-4">
        <SidebarItem text="Monitoring Data Guru" />
        <SidebarItem text="Monitoring Data Siswa" />
        <SidebarItem text="Monitoring Jadwal" />
      </div>
    </div>
  );
};

export default Sidebar;
