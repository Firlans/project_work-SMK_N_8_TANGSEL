import { useInView } from "react-intersection-observer";
import roleFeatures from "./features";

const MainSplitLayout = () => {
  // Buat observer untuk Section 1 (judul)
  const [section1Ref, section1InView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <main className="relative pt-16 min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/bg-landing.jpg')" }}
      />
      {/* Overlay warna gelap */}
      <div className="absolute inset-0 bg-indigo-900/80 z-10" />

      {/* SECTION 1 */}
      <section
        ref={section1Ref}
        className={`relative z-20 py-14 px-3 sm:py-16 sm:px-6 md:py-20 md:px-8 text-center max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto mt-4 transition-all duration-700 ease-out ${
          section1InView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-slate-50 leading-tight">
          SIMPUL8 - Sistem Informasi Manajemen Pemantauan untuk
          <br className="hidden md:block" />
          Lingkungan SMK Negeri 8 Kota Tangerang Selatan
        </h2>
        <p className="max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-200">
          Satu platform terintegrasi untuk mengelola data siswa, guru, konselor,
          admin, dan wali murid. Pantau jadwal, pelanggaran, prestasi, dan
          komunikasi bimbingan konseling secara real-time.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="relative z-20 py-16 px-4 space-y-16">
        {roleFeatures.map((item, index) => {
          const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1,
          });

          return (
            <div
              key={index}
              ref={ref}
              className={`max-w-6xl mx-auto flex flex-col md:flex-row ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              } items-center gap-10 transition-all duration-700 ease-out ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Ilustrasi */}
              <div className="w-full md:w-1/2">
                <img
                  src={item.image}
                  alt={item.role}
                  className="w-full h-auto drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Teks */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 text-amber-500/90">
                  {item.role}
                </h3>
                <h4 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-200">{item.description}</p>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default MainSplitLayout;
