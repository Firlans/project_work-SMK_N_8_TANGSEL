import AuthLayout from "../Components/Layouts/AuthLayouts";
import FormLogin from "../Components/Fragments/FormLogin";

const LoginPage = () => {
  return (
    <div className="bg-indigo-950">
      <AuthLayout title="Login" type="login">
        <FormLogin />
      </AuthLayout>
    </div>
  );
};

export default LoginPage;
