import React from "react";
import { useGetUsersQuery } from "../../../../redux/api/users";
import PrimaryCard from "./PrimaryCard";

const RealTimeCard = () => {
  const { data: visitors } = useGetUsersQuery();

  return (
    <div className="bg-white text-gray-800 rounded-xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-2">Realtime Stats</h2>
      <p className="text-gray-600 mb-4">Live Updates</p>
      
      <div className="border-t border-gray-200 my-4"></div>
      
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-600">{visitors?.length}</h2>
        <p className="text-gray-600">Current Subscribers</p>
      </div>
      
      <PrimaryCard />
    </div>
  );
};

export default RealTimeCard;