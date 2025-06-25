import FormLogin from "../../Components/Fragments/FormLogin";
import AuthLayout from "../../Components/Layouts/AuthLayouts";

const LoginAdmin = () => {
  return (
    <div>
      <AuthLayout title="Log In" type="login">
        <FormLogin role="admin" />
      </AuthLayout>
    </div>
  );
};

export default LoginAdmin;
