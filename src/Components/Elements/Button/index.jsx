const Button = (props) => {
  const {
    children = "ini button",
    classname = "",
    onClick = () => {},
    type = "button",
  } = props;
  return (
    <button
      className={`h-10 px-6 font-semibold rounded-md bg-slate-700 ${classname} text-white`}
      type={type}
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
};

export default Button;
