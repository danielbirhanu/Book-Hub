import { useGetUsersQuery } from "../../../../redux/api/users";
import PrimaryCard from "./PrimaryCard";

const RealTimeCard = () => {
  const { data: visitors } = useGetUsersQuery();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Realtime</h2>
      <p className="text-sm text-gray-500 mb-4">Update Live</p>
      <div className="border-t border-gray-200 my-4"></div>
      <h2 className="text-3xl font-bold text-green-600">{visitors?.length}</h2>
      <p className="text-gray-600 mb-4">Subscribers</p>
      <PrimaryCard />
    </div>
  );
};

export default RealTimeCard;
