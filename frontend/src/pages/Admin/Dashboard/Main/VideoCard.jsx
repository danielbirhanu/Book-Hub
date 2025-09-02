import React from "react";

const VideoCard = ({ image, title, date, comments }) => {
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
      <div className="flex-shrink-0">
        <img src={image} alt={title} className="h-14 w-10 object-cover rounded shadow-sm" />
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <h3 className="text-gray-800 font-medium truncate">{title}</h3>
        <p className="text-gray-600 text-sm">{date}</p>
      </div>
      
      <div className="ml-4 flex items-center">
        <span className="text-blue-600 font-semibold">{comments}</span>
        <svg className="w-5 h-5 text-gray-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default VideoCard;