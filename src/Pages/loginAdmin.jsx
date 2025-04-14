import FormLogin from "../Components/Fragments/FormLogin";
import AuthLayout from "../Components/Layouts/AuthLayouts";

const LoginAdmin = () => {
  return (
    <div className="bg-indigo-950">
      <AuthLayout title="Login" type="login">
        <FormLogin role="admin" />
      </AuthLayout>
    </div>
  );
};

export default LoginAdmin;
