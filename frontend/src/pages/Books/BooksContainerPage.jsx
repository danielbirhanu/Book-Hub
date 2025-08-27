import { useState } from "react";
import {
  useGetNewBooksQuery,
  useGetTopBooksQuery,
  useGetRandomBooksQuery,
} from "../../redux/api/books";

import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../components/SliderUtil";

const BooksContainerPage = () => {
  const { data } = useGetNewBooksQuery();
  const { data: topBooks } = useGetTopBooksQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: randomBooks } = useGetRandomBooksQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
  };

  const filteredBooks = data?.filter(
    (book) => selectedGenre === null || book.genre === selectedGenre
  );

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-8">
      <div className="w-full lg:w-64 flex-shrink-0 self-start">
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Genres</h2>
          <div className="flex flex-wrap lg:flex-col gap-2">
            {genres?.map((g) => (
              <button
                key={g._id}
                className={`transition duration-300 ease-in-out hover:bg-teal-100 py-2 px-4 rounded-lg text-left ${
                  selectedGenre === g._id ? "bg-teal-100 text-teal-800 font-medium" : "bg-slate-100"
                }`}
                onClick={() => handleGenreClick(g._id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="flex flex-col justify-center items-center w-full lg:w-auto">
        <div className="w-full lg:w-[100rem] mb-8 ">
          <h1 className="mb-5">Choose For You</h1>
          <SliderUtil data={randomBooks} />
        </div>

        <div className="w-full lg:w-[100rem] mb-8">
          <h1 className="mb-5">Top Books</h1>
          <SliderUtil data={topBooks} />
        </div>

        <div className="w-full lg:w-[100rem] mb-8">
          <h1 className="mb-5">Choose Movie</h1>
          <SliderUtil data={filteredBooks} />
        </div>
      </section>
    </div>
  );
};

export default BooksContainerPage;
