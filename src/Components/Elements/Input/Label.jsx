const Label = (props) => {
  const { htmlFor, children, colorClass = "text-slate-700" } = props;
  return (
    <label
      htmlFor={htmlFor}
      className={`block ${colorClass} text-sm font-bold mb-2`}
    >
      {children}
    </label>
  );
};

export default Label;
