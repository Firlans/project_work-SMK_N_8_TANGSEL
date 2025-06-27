const SelectField = ({
  label,
  value,
  onChange,
  options,
  error,
  placeholder,
}) => {
  return (
    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded p-2 transition-colors
    ${error ? "border-red-500" : ""}
    ${value === "" ? "text-gray-400" : "dark:text-white text-black"}
    dark:bg-gray-800 dark:border-gray-700
  `}
      >
        {(value === "" || value === undefined || value === null) && (
          <option value="" disabled>
            {placeholder || `-- Pilih ${label} --`}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default SelectField;
