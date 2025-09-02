import React from "react";

const SecondaryCard = ({ pill, content, info, gradient }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className={`inline-block rounded-full py-2 px-4 text-xs font-semibold bg-gradient-to-r ${gradient} text-white mb-4`}>
          {pill}
        </div>
        
        <div className="mb-4">
          <h2 className="text-4xl font-bold text-gray-800">{content}</h2>
        </div>
        
        <p className="text-gray-600 text-sm">{info}</p>
      </div>
      
      <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
    </div>
  );
};

export default SecondaryCard;