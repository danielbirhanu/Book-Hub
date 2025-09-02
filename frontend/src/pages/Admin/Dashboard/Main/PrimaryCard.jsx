import { useGetUsersQuery } from "../../../../redux/api/users";

const PrimaryCard = () => {
  const { data: visitors } = useGetUsersQuery();

  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
      <h2 className="text-lg font-semibold">Congratulations 🎉</h2>
      <p className="text-sm">You have {visitors?.length} new users watching your content.</p>
    </div>
  );
};

export default PrimaryCard;
