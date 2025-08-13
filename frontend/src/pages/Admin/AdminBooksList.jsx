import { Link } from "react-router-dom";
import { useGetAllBooksQuery } from "../../redux/api/books";

const AdminBooksList = () => {
  const { data: books } = useGetAllBooksQuery();

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2c3e50]">
            All Books ({books?.length || 0})
          </h1>
          <p className="text-[#7f8c8d]">Manage your book collection</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books?.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={book.image}
                alt={book.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4 border-t border-[#bdc3c7]">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-bold text-[#2c3e50] truncate">
                    {book.name}
                  </h2>
                </div>
                
                <p className="text-sm text-[#3498db] font-medium mb-2">
                  by {book.author}
                </p>
                
                <p className="text-sm text-[#7f8c8d] line-clamp-2 mb-4">
                  {book.detail}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#7f8c8d]">
                    {book.year}
                  </span>
                  <Link
                    to={`/admin/books/update/${book._id}`}
                    className="bg-[#3498db] hover:bg-[#2980b9] text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Update
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBooksList;