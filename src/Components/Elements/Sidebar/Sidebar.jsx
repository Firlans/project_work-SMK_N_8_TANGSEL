import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = ({
  title,
  menuItems,
  setActivePage,
  activePage,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when resizing to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
        fixed top-4 left-4 z-50 p-2
        bg-blue-500 text-white rounded-lg 
        hover:bg-blue-600 active:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        transition-all duration-300 ease-in-out
        lg:hidden
        ${isOpen ? "translate-x-64" : "translate-x-0"}
        ${className}
      `}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <FaTimes className="w-5 h-5" />
        ) : (
          <FaBars className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`
        fixed top-0 bottom-0 left-0 w-64
        bg-white border-r shadow-lg
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:sticky lg:top-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        z-40
      `}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 truncate mt-2">
            {title}
          </h2>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`
              w-full flex items-center gap-3 px-3 py-2.5
              rounded-lg text-left transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${
                activePage === item.id
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      <div
        className={`
        fixed inset-0 bg-black/50 backdrop-blur-sm
        transition-opacity duration-300 ease-in-out lg:hidden
        ${isOpen ? "opacity-100 z-30" : "opacity-0 pointer-events-none"}
      `}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
};

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ).isRequired,
  setActivePage: PropTypes.func.isRequired,
  activePage: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Sidebar;
