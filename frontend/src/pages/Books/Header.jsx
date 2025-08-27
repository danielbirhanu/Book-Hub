import { useGetNewBooksQuery } from "../../redux/api/books";
import { Link } from "react-router-dom";

const Header = () => {
  const { data } = useGetNewBooksQuery();

  return (
    <header className="bg-white shadow-sm text-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800">Book Hub</h1>
            <p className="text-gray-600 mt-1">Discover your next favorite read</p>
          </div>
          
          <nav>
            <Link
              to="/books"
              className="bg-[#3498db] hover:bg-[hsl(204,64%,40%)] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Browse Books
            </Link>
          </nav>
        </div>
        
        {data && data.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">New Arrivals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.slice(0, 5).map(book => (
                <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                  <img 
                    src={book.image} 
                    alt={book.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 truncate">{book.name}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;