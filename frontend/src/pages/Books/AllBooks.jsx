import { useGetAllBooksQuery } from "../../redux/api/books";
import { useFetchGenresQuery } from "../../redux/api/genre";
import {
  useGetNewBooksQuery,
  useGetTopBooksQuery,
  useGetRandomBooksQuery,
} from "../../redux/api/books";
import BookCard from "./BookCard";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setBooksFilter,
  setFilteredBooks,
  setBookYears,
  setUniqueYears,
} from "../../redux/features/books/booksSlice";

const AllBooks = () => {
  const dispatch = useDispatch();
  const { data } = useGetAllBooksQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: newBooks } = useGetNewBooksQuery();
  const { data: topBooks } = useGetTopBooksQuery();
  const { data: randomBooks } = useGetRandomBooksQuery();

  const { booksFilter, filteredBooks } = useSelector((state) => state.books);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const bookYears = data?.map((book) => book.year);
  const uniqueYears = Array.from(new Set(bookYears));

  useEffect(() => {
    dispatch(setFilteredBooks(data || []));
    dispatch(setBookYears(bookYears));
    dispatch(setUniqueYears(uniqueYears));
  }, [data, dispatch]);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    dispatch(setBooksFilter({ 
      ...booksFilter, 
      searchTerm 
    }));

    const filteredBooks = data.filter((book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    dispatch(setFilteredBooks(filteredBooks));
  };

  const handleGenreClick = (genreId) => {
    dispatch(setBooksFilter({ 
      ...booksFilter, 
      selectedGenre: genreId 
    }));
    
    const filterByGenre = data.filter((book) => book.genre === genreId);
    dispatch(setFilteredBooks(filterByGenre));
  };

  const handleYearChange = (year) => {
    dispatch(setBooksFilter({ 
      ...booksFilter, 
      selectedYear: year 
    }));
    
    const filterByYear = data.filter((book) => book.year === +year);
    dispatch(setFilteredBooks(filterByYear));
  };

  const handleSortChange = (sortOption) => {
    dispatch(setBooksFilter({ 
      ...booksFilter, 
      selectedSort: sortOption 
    }));
    
    switch (sortOption) {
      case "new":
        dispatch(setFilteredBooks(newBooks));
        break;
      case "top":
        dispatch(setFilteredBooks(topBooks));
        break;
      case "random":
        dispatch(setFilteredBooks(randomBooks));
        break;
      default:
        dispatch(setFilteredBooks(data || []));
        break;
    }
  };

  const clearFilters = () => {
    dispatch(setBooksFilter({ 
      searchTerm: "", 
      selectedGenre: "", 
      selectedYear: "", 
      selectedSort: "" 
    }));
    dispatch(setFilteredBooks(data || []));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Hero Section */}
      <section className="relative h-[25rem] w-full flex items-center justify-center bg-cover bg-center mb-24" 
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-70"></div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">The Books Hub</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-12">
            Literary Journey: Unveiling the Magic of Books
          </p>
        </div>

        {/* Search Bar */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl">
          <div className="relative">
            <input
              type="text"
              className="w-full h-12 pl-12 pr-6 text-lg rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Search for books by title..."
              value={booksFilter.searchTerm || ""}
              onChange={handleSearchChange}
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        {/* Filter Toggle for Mobile */}
        <div className="lg:hidden flex justify-center mb-8">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
            <svg 
              className={`ml-3 h-5 w-5 transform ${isFilterOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className={`lg:w-1/4 bg-white p-6 rounded-lg shadow-md ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-8">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Genre</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={booksFilter.selectedGenre || ""}
                  onChange={(e) => handleGenreClick(e.target.value)}
                >
                  <option value="">All Genres</option>
                  {genres?.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Publication Year</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={booksFilter.selectedYear || ""}
                  onChange={(e) => handleYearChange(e.target.value)}
                >
                  <option value="">All Years</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={booksFilter.selectedSort || ""}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="new">New Books</option>
                  <option value="top">Top Books</option>
                  <option value="random">Random Selection</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Books Grid */}
          <main className="lg:w-3/4">
            <div className="mb-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredBooks?.length} {filteredBooks?.length === 1 ? 'Book' : 'Books'} Found
              </h2>
            </div>

            {filteredBooks && filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-md">
                <svg 
                  className="mx-auto h-16 w-16 text-gray-400 mb-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-4">No books found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllBooks;