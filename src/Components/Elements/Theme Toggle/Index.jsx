import { useTheme } from "../../../contexts/ThemeProvider";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const { dark, toggleDark } = useTheme();

  return (
    <button
      onClick={toggleDark}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md transition 
      bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:scale-105"
    >
      {dark ? (
        <FaSun className="text-yellow-400" />
      ) : (
        <FaMoon className="text-blue-600" />
      )}
      <span className="text-sm font-medium hidden sm:inline">
        {dark ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;
