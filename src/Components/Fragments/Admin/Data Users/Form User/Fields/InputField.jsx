import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  error,
  showToggle = false,
  togglePassword,
  mode,
}) => {
  return (
    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300">
        {label}{" "}
        {mode === "edit" && label.toLowerCase().includes("password") && (
          <span className="text-xs">(Kosongkan jika tidak ingin mengubah)</span>
        )}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded p-2 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors ${
            error ? "border-red-500" : ""
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {type === "password" ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default InputField;
