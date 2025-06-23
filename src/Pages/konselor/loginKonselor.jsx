import FormLogin from "../../Components/Fragments/FormLogin";
import AuthLayout from "../../Components/Layouts/AuthLayouts";

const LoginKonselor = () => {
  return (
    <div className="bg-indigo-950">
      <AuthLayout title="Log In" type="login">
        <FormLogin role="konselor" />
      </AuthLayout>
    </div>
  );
};

export default LoginKonselor;
