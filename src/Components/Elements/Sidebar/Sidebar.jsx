import React, { useState } from "react";
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

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-4 left-4 z-30 p-2 
          bg-blue-500 text-white rounded-lg 
          hover:bg-blue-600 transition-colors
          lg:hidden
          ${isOpen ? "translate-x-64" : "translate-x-0"}
          transition-transform duration-300
        `}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-20
          transform transition-all duration-300 ease-in-out
          w-64 bg-white border-r h-screen shadow-sm
          lg:translate-x-0 ${
            isOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 lg:opacity-100"
          }
          ${className}
        `}
      >
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  activePage === item.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
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
