import AuthLayout from "../../Components/Layouts/AuthLayouts";
import FormLogin from "../../Components/Fragments/FormLogin";

const LoginSiswa = () => {
  return (
    <div className="bg-indigo-950">
      <AuthLayout title="Log In" type="login">
        <FormLogin role="siswa" />
      </AuthLayout>
    </div>
  );
};

export default LoginSiswa;
