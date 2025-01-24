// import { useNavigate } from "react-router-dom";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input/Index";
// import { useState } from "react";

const FormLogin = () => {
  // const [nisnOrNip, setNisnOrNip] = useState("");
  // const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    window.location.href = "/dashboardGuru";

    // if (nisnOrNip.startsWith("G") && password) {
    //   window.location.href = "/dashboardGuru";
    // } else if (nisnOrNip.startsWith("S") && password) {
    //   window.location.href = "/dashboardSiswa";
    // } else {
    //   alert("NISN/NIP atau Password salah. Silakan coba lagi.");
    // }
  };

  return (
    <form onSubmit={handleLogin}>
      <InputForm
        label="NIP / NISN"
        type="text"
        placeholder="NIP / NISN"
        name="nisnOrNip"
        // value={nisnOrNip}
        // onChange={(e) => setNisnOrNip(e.target.value)}
        // required
      />
      <InputForm
        label="Password"
        type="password"
        placeholder="*****"
        name="password"
        // value={password}
        // onChange={(e) => setPassword(e.target.value)}
        // required
      />
      <Button type="submit" classname="bg-amber-500 w-full">
        Login
      </Button>
    </form>
  );
};

export default FormLogin;
