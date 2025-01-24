const SideBar = (props) => {
  const { title } = props;
  return (
    <div
      className="bg-indigo-900 text-white h-screen
            px-4 fixed w-16 md:w-64 "
    >
      <h1 className="text-2xl font-bold hidden md:block mt-10 text-center ">
        SMK Negeri 8 Kota Tangerang Selatan
      </h1>

      <h1 className="text-xl font-bold hidden md:block mt-7 text-center">
        {title}
      </h1>
      <ul className="flex flex-col mt-5 text-base">
        <li
          className="flex items-center py-3 px-2 space-x-4
            hover:rounded hover:cursor-pointer hover:bg-indigo-950"
        >
          <span
            className="hidden md:inline"
            onClick={() => (window.location.href = "/presensi")}
          >
            Monitoring Presensi Siswa/i
          </span>
        </li>
        <li
          className="flex items-center py-3 px-2 space-x-4
            hover:rounded hover:cursor-pointer hover:bg-indigo-950"
        >
          <span
            className="hidden md:inline"
            onClick={() => (window.location.href = "/jadwal-guru")}
          >
            Jadwal Mengajar
          </span>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
