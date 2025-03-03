const ProfileInfo = ({ name, id }) => {
  return (
    <div className="p-4 border-b">
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm text-gray-500">NIP: {id}</p>
    </div>
  );
};

export default ProfileInfo;
