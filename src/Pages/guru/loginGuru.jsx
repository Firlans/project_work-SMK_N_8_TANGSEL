import FormLogin from "../../Components/Fragments/FormLogin";
import AuthLayout from "../../Components/Layouts/AuthLayouts";

const LoginGuru = () => {
  return (
    <div className="bg-indigo-950">
      <AuthLayout title="Log In" type="login">
        <FormLogin role="guru" />
      </AuthLayout>
    </div>
  );
};

export default LoginGuru;
