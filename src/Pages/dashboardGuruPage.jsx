import Button from "../Components/Elements/Button";
import Header from "../Components/Elements/Header/Index";
import Profile from "../Components/Fragments/Profile";
import { useNavigate } from "react-router-dom";

const DashboardGuruPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Header />
      <main className="flex flex-col lg:flex-row w-full max-w-6xl mt-8 gap-6">
        <Profile />
        <section className="flex flex-col gap-4 w-full lg:w-1/3">
          <Button
            className="bg-indigo-900 text-white font-medium h-20"
            onClick={() => navigate("/jadwal-guru")}
          >
            Jadwal Mengajar
          </Button>
          <Button className="bg-indigo-900 text-white font-medium h-20"
          onClick={() => navigate("/monitoring-presensi")}>
            Presensi Siswa
          </Button>
        </section>
      </main>
    </div>
  );
};

export default DashboardGuruPage;
