const SecondaryCard = ({ pill, content, info, gradient }) => {
  return (
    <div
      className={`relative bg-gradient-to-r ${gradient} rounded-xl shadow-lg p-6 flex flex-col justify-between`}
    >
      <div className="absolute -top-3 left-6 bg-white px-4 py-1 rounded-full text-sm font-medium text-gray-700 shadow">
        {pill}
      </div>
      <div className="flex items-center justify-center h-full">
        <h2 className="text-4xl font-bold text-white">{content}</h2>
      </div>
      <p className="text-sm text-white mt-2">{info}</p>
    </div>
  );
};

export default SecondaryCard;
