import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Input = ({ type, placeholder, name, value, onChange }) => {
  // State untuk menampilkan password
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <input
        type={type === "password" && showPassword ? "text" : type}
        className="text-sm border rounded w-full py-2 px-3 text-slate-700 placeholder-opacity-50"
        placeholder={placeholder}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      )}
    </div>
  );
};

export default Input;
