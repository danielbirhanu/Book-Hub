import { useState } from "react";
import {
  useGetNewBooksQuery,
  useGetTopBooksQuery,
  useGetRandomBooksQuery,
} from "../../redux/api/books";
import { useFetchGenresQuery } from "../../redux/api/genre";
import BookCard from "./BookCard";

const BooksContainerPage = () => {
  const { data } = useGetNewBooksQuery();
  const { data: topBooks } = useGetTopBooksQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: randomBooks } = useGetRandomBooksQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
  };

  const filteredBooks = data?.filter(
    (book) => selectedGenre === null || book.genre === selectedGenre
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Genre sidebar */}
        <div className="lg:w-1/5">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Genres</h2>
            <div className="space-y-2">
              {genres?.map((g) => (
                <button
                  key={g._id}
                  className={`w-full text-left px-3 py-2 rounded-md transition duration-200 ${
                    selectedGenre === g._id 
                      ? "bg-indigo-100 text-indigo-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleGenreClick(g._id)}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Books content */}
        <div className="lg:w-4/5">
          {/* Recommended for you section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {randomBooks?.slice(0, 5).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>

          {/* Top books section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Top Rated Books</h2>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {topBooks?.slice(0, 5).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>

          {/* Books by genre section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedGenre 
                  ? `Books in ${genres?.find(g => g._id === selectedGenre)?.name}` 
                  : "All Books"}
              </h2>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredBooks?.slice(0, 10).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BooksContainerPage;