const CheckboxField = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-amber-500"
      />
      <label className="text-gray-700 dark:text-gray-300 capitalize">
        {label}
      </label>
    </div>
  );
};

export default CheckboxField;
