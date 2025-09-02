import React from "react";
import { useGetUsersQuery } from "../../../../redux/api/users";

const PrimaryCard = () => {
  const { data: visitors } = useGetUsersQuery();

  return (
    <div className="bg-white text-gray-800 rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-3">Congratulations! 🎉</h2>
      <p className="text-gray-600">You have {visitors?.length} new users watching your content.</p>
    </div>
  );
};

export default PrimaryCard;