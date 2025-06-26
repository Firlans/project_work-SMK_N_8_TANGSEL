import { useEffect } from "react";
import PropTypes from "prop-types";

const Sidebar = ({
  title,
  menuItems,
  setActivePage,
  activePage,
  isOpen,
  setIsOpen,
  profile,
}) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const renderProfileInfo = () => {
    if (!profile) return null;

    const { nama_lengkap, nama, nis, nip, kelas } = profile;

    return (
      <div className="mt-2 text-sm text-slate-700 dark:text-white space-y-0.5">
        <div className="text-center font-semibold truncate">
          {nama_lengkap || nama}
        </div>
        {nis && <div className="text-center">NIS. {nis}</div>}
        {nip && <div className="text-center">NIP. {nip}</div>}
        {kelas?.nama_kelas && (
          <div className="text-center">{kelas.nama_kelas}</div>
        )}
      </div>
    );
  };

  return (
    <>
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen 
          bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-700 
          shadow-lg transform transition-all duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:block flex flex-col`}
      >
        {/* === Header === */}
        <div className="p-4 border-b bg-white dark:bg-gray-800 shrink-0 transition-all duration-300">
          <h2 className="text-xl text-center font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          {renderProfileInfo()}
        </div>

        {/* === Menu === */}
        <nav className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 ${
                activePage === item.id
                  ? "bg-blue-800 dark:bg-amber-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-blue-100 hover:text-slate-900 dark:text-white dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* === Overlay (mobile) === */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-all duration-300 lg:hidden 
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
};

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  menuItems: PropTypes.array.isRequired,
  setActivePage: PropTypes.func.isRequired,
  activePage: PropTypes.string.isRequired,
  profile: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default Sidebar;
