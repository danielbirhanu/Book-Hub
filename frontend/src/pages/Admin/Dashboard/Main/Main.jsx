import SecondaryCard from "./SecondaryCard";
import VideoCard from "./VideoCard";
import RealTimeCard from "./RealTimeCard";
import {
  useGetTopBooksQuery,
  useGetAllBooksQuery,
} from "../../../../redux/api/books";
import { useGetUsersQuery } from "../../../../redux/api/users";

const Main = () => {
  const { data: topBooks } = useGetTopBooksQuery();
  const { data: visitors } = useGetUsersQuery();
  const { data: allBooks } = useGetAllBooksQuery();

  const totalCommentsLength = allBooks?.map((m) => m.numReviews);
  const sumOfCommentsLength = totalCommentsLength?.reduce(
    (acc, length) => acc + length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SecondaryCard
          pill="Users"
          content={visitors?.length}
          info="3 more than usual"
          gradient="from-green-500 to-emerald-400"
        />
        <SecondaryCard
          pill="Comments"
          content={sumOfCommentsLength}
          info="2 more than usual"
          gradient="from-yellow-400 to-amber-300"
        />
        <SecondaryCard
          pill="Books"
          content={allBooks?.length}
          info="5 more than usual"
          gradient="from-lime-500 to-green-400"
        />
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between mb-4 font-semibold text-gray-700">
            <p>Top Content</p>
            <p>Comments</p>
          </div>
          <div className="divide-y divide-gray-200">
            {topBooks?.map((book) => (
              <VideoCard
                key={book._id}
                image={book.image}
                title={book.name}
                date={book.year}
                comments={book.numReviews}
              />
            ))}
          </div>
        </div>

        <RealTimeCard />
      </div>
    </div>
  );
};

export default Main;
