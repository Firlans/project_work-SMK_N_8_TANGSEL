const AuthLayout = (props) => {
  const { children, title } = props;
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg-landing.jpg')",
        }}
      />

      {/* Overlay biru + blur */}
      <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm" />

      {/* Konten Login */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-2 sm:mx-4 bg-white p-4 sm:p-8 rounded-2xl shadow-2xl space-y-6 animate-fadeIn">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Selamat Datang, silahkan isi data di bawah.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
