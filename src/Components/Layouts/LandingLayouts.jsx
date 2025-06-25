import Footer from "../Elements/Footer";
import LandingHeader from "../Fragments/Landing Page/LandingHeader";
import Main from "../Fragments/Landing Page/Main/Index";

const LandingPage = () => {
  return (
    <div
      className="flex flex-col min-h-[calc(100vh-4rem)] bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/bg-landing.jpg')",
      }}
    >
      <div className="bg-indigo-900/80">
        <LandingHeader />
        <Main />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
