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
        </div>
      </div>
    </div>
  );
};

export default BookCard;