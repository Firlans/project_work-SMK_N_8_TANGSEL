const TextareaField = ({ label, value, onChange, error }) => {
  return (
    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default TextareaField;
