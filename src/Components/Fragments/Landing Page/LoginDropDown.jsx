import { useState, useRef, useEffect } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import {
  FaCircleChevronDown,
  FaUserGraduate,
  FaUserShield,
  FaUserTie,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const LoginDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles = [
    {
      label: "Siswa",
      to: "/login-siswa",
      icon: <FaUserGraduate className="text-blue-500" />,
    },
    {
      label: "Guru",
      to: "/login-guru",
      icon: <FaChalkboardTeacher className="text-green-500" />,
    },
    {
      label: "Konselor",
      to: "/login-konselor",
      icon: <FaUserTie className="text-yellow-500" />,
    },
    {
      label: "Admin",
      to: "/login-admin",
      icon: <FaUserShield className="text-red-500" />,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1 bg-amber-600/80  text-slate-100 rounded-full hover:bg-amber-700/80 transition-all duration-300"
      >
        Masuk
        <FaCircleChevronDown className="text-lg" />
      </button>

      <div
        className={`absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-50 transform origin-top-right transition-all duration-300 overflow-hidden
          ${
            dropdownOpen
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible"
          }`}
      >
        <h3 className="px-4 py-2 bg-gray-200  text-sm text-center font-semibold text-gray-800 ">
          Masuk Sebagai
        </h3>
        <ul className="divide-y divide-gray-200">
          {roles.map((role) => (
            <li key={role.label}>
              <Link
                to={role.to}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                {role.icon}
                {role.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoginDropdown;
