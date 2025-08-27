import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="group">
      <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300 bg-white h-full flex flex-col">
        <Link to={`/books/${book._id}`} className="flex-grow">
          <div className="relative overflow-hidden">
            <img
              src={book.image}
              alt={book.name}
              className="w-full h-60 object-cover transition duration-300 transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
              <div>
                <h3 className="text-white font-bold text-sm">{book.name}</h3>
                <p className="text-gray-200 text-xs">{book.author}</p>
              </div>
            </div>
          </div>
        </Link>
        <div className="p-3 flex-grow">
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{book.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-gray-600 ml-1">4.5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;