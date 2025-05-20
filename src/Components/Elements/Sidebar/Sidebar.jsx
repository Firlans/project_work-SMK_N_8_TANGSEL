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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 z-30 p-3">
        {" "}
        {/* Updated positioning */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
      p-2 
      bg-blue-500 text-white rounded-lg 
      hover:bg-blue-600 active:bg-blue-700
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      transition-all duration-300 ease-in-out
      ${isOpen ? "translate-x-64" : "translate-x-0"}
    `}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <FaTimes className="w-5 h-5" />
          ) : (
            <FaBars className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-20
          w-64 min-h-screen
          bg-white border-r shadow-sm
          transform transition-all duration-300 ease-in-out
          overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300
          lg:translate-x-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${className}
        `}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
            {title}
          </h2>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="p-4 sm:p-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 
                px-3 py-2.5 sm:py-3
                rounded-lg text-left
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  activePage === item.id
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <span className="text-xl sm:text-lg">{item.icon}</span>
              <span className="text-sm sm:text-base font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
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
