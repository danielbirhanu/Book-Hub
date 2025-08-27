import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="px-2">
      <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <Link to={`/books/${book._id}`}>
          <img
            src={book.image}
            alt={book.name}
            className="w-full h-64 object-cover transition duration-300 transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
            <div>
              <h3 className="text-white font-bold text-lg">{book.name}</h3>
              <p className="text-gray-200 text-sm">{book.author}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BookCard;