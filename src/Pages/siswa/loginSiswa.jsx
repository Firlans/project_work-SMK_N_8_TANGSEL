import AuthLayout from "../../Components/Layouts/AuthLayouts";
import FormLogin from "../../Components/Fragments/FormLogin";

const LoginSiswa = () => {
  return (
    <div>
      <AuthLayout title="Log In" type="login">
        <FormLogin role="siswa" />
      </AuthLayout>
    </div>
  );
};

export default LoginSiswa;
