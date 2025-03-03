import React from "react";

const Button = ({
  children,
  className = "",
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`h-10 px-6 rounded-md font-medium ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
