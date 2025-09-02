import React from "react";
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SecondaryCard
          pill="Users"
          content={visitors?.length}
          info="20.2k more than usual"
          gradient="from-blue-500 to-cyan-400"
        />
        <SecondaryCard
          pill="Comments"
          content={sumOfCommentsLength}
          info="742.8 more than usual"
          gradient="from-amber-500 to-yellow-400"
        />
        <SecondaryCard
          pill="Books"
          content={allBooks?.length}
          info="372+ more than usual"
          gradient="from-green-500 to-emerald-400"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Top Content</h2>
              <p className="text-gray-600 font-semibold">Comments</p>
            </div>
            
            <div className="space-y-4">
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
        </div>
        
        <div className="lg:col-span-1">
          <RealTimeCard />
        </div>
      </div>
    </div>
  );
};

export default Main;