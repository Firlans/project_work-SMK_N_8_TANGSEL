const Input = ({ type, placeholder, name, value, onChange }) => {
  return (
    <input
      type={type}
      className="text-sm border rounded w-full py-2 px-3 text-slate-700 placeholder-opacity-50"
      placeholder={placeholder}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
