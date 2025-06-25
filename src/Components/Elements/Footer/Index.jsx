import { FaInstagram } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-amber-600/60 text-white transition-colors duration-300 py-8 rounded-tl-xl rounded-tr-xl">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left transition-all duration-300">
        {/* Logo & Nama Sekolah */}
        <div className="order-1 md:order-2 flex flex-col items-center">
          <img
            src="/images/logo-smkn8tangsel.png"
            alt="Logo SMKN8"
            className="h-16 mb-2 transition-all duration-300"
          />
          <h4 className="font-bold uppercase text-center text-sm sm:text-base text-white transition-colors duration-300">
            SMK NEGERI 8 <br className="md:hidden" />
            KOTA TANGERANG SELATAN
          </h4>
        </div>

        {/* Alamat & Sosial Media */}
        <div className="order-2 md:order-1 text-white transition-colors duration-300">
          <h4 className="font-semibold mb-2">Alamat</h4>
          <p className="text-sm leading-snug text-gray-200 transition-colors">
            Jl. H. Jamad. Gg. Rais. Kel. Buaran. Kec. Serpong.
            <br />
            Kota Tangerang Selatan. Prov. Banten
          </p>

          <h4 className="font-semibold mt-4 mb-2">Temui Kami</h4>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://www.instagram.com/smkn8tangsel/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-pink-300"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://smkn8tangsel.sch.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-amber-200"
            >
              <TbWorld size={20} />
            </a>
          </div>
        </div>

        {/* Profil Sekolah */}
        <div className="order-3 flex flex-col items-center md:items-end text-white transition-colors duration-300 md:text-right">
          <a
            href="https://smkn8tangsel.sch.id/profil-sekolah/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h4 className="font-semibold mb-2 hover:underline transition-all duration-300">
              Profil Sekolah
            </h4>
          </a>
          <ul className="text-sm space-y-1 text-gray-200 transition-colors">
            {[
              {
                text: "Identitas Sekolah",
                link: "https://smkn8tangsel.sch.id/identitas-sekolah/",
              },
              {
                text: "Fasilitas",
                link: "https://smkn8tangsel.sch.id/fasilitas/",
              },
              {
                text: "Staf Pengajar",
                link: "https://smkn8tangsel.sch.id/guru/",
              },
              {
                text: "Staf Tenaga Kependidikan",
                link: "https://smkn8tangsel.sch.id/tendik/",
              },
              {
                text: "Informasi",
                link: "https://smkn8tangsel.sch.id/informasi/",
              },
              {
                text: "Masuk Orang Tua/Wali",
                link: "/login-wali-murid", // internal route
              },
            ].map((item, idx) => {
              const isExternal = item.link.startsWith("http");

              return (
                <li key={idx}>
                  <a
                    href={item.link}
                    {...(isExternal && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="hover:underline transition-all duration-300"
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-xs text-center font-semibold text-gray-300 transition-colors duration-300">
        © {currentYear} CRM SMK Negeri 8 Kota Tangerang Selatan
      </div>
    </footer>
  );
};

export default Footer;
