import Button from "../Elements/Button";

const Profile = () => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md w-full lg:w-2/3">
      <h2 className="text-xl font-semibold mb-6 text-center">PROFIL</h2>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
          <button className="mt-4 px-4 py-2 bg-gray-300 rounded-md font-medium">
            Ubah Profil
          </button>
        </div>
        <div className="flex flex-col space-y-2 text-sm">
          <p>
            <span className="font-semibold">Nama:</span> John Doe
          </p>
          <p>
            <span className="font-semibold">NIP:</span> 123456789
          </p>
          <p>
            <span className="font-semibold">Jenis Kelamin:</span> Laki-laki
          </p>
          <p>
            <span className="font-semibold">Role:</span> Guru
          </p>
        </div>
      </div>
    </section>
  );
};

export default Profile;
