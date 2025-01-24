const Label = (props) => {
  const { htmlFor, children } = props;
  return (
    <label
      htmlFor={htmlFor}
      className="block text-white text-sm font-bold mb-2"
    >
      {children}
    </label>
  );
};

export default Label;
