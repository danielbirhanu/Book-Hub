const VideoCard = ({ image, title, date, comments }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <img src={image} alt="Book" className="h-12 w-12 object-cover rounded-md" />
        <div>
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <span className="text-gray-700 font-medium">{comments}</span>
    </div>
  );
};

export default VideoCard;
