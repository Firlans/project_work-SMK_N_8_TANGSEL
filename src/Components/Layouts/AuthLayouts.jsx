const AuthLayout = (props) => {
  const { children, title } = props;
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="w-full max-w-xs">
        <h1 className="text-3xl font-bold mb-2 text-white">{title}</h1>
        <p className="font-medium text-slate-500 mb-8">
          Selamat Datang, silahkan isi data di bawah.
        </p>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
