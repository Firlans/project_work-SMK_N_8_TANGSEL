const Card = ({ title, value }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-5 w-64">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Card;
