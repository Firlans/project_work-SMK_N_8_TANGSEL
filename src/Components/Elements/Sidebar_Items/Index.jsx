const SidebarItem = ({ text }) => {
  return (
    <div className="py-2 px-4 hover:bg-gray-200 rounded cursor-pointer">
      {text}
    </div>
  );
};

export default SidebarItem;
