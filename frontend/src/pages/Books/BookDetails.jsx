import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificBookQuery,
  useAddBookReviewMutation,
} from "../../redux/api/books";
import BookTabs from "./BookTabs";

const BookDetails = () => {
  const { id: bookId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data: book, refetch } = useGetSpecificBookQuery(bookId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingBookReview }] =
    useAddBookReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        id: bookId,
        rating,
        comment,
      }).unwrap();

      refetch();
      setRating(0);
      setComment("");
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 group"
          >
            <svg 
              className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </Link>
        </div>

        {/* Book Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="md:flex">
            {/* Book Image */}
            <div className="md:flex-shrink-0 md:w-1/3 lg:w-1/4 p-8 flex justify-center items-start bg-gray-50">
              <div className="relative">
                <img 
                  src={book?.image} 
                  alt={book?.name} 
                  className="w-full max-w-xs rounded-xl shadow-lg object-cover transition-transform duration-300 hover:scale-105" 
                />
                <div className="absolute -inset-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 -z-10 opacity-70 blur-sm"></div>
              </div>
            </div>
            
            {/* Book Details */}
            <div className="p-8 md:pl-6 flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">{book?.name}</h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed border-l-4 border-indigo-100 pl-4">
                {book?.detail}
              </p>
              
              <div className="border-t border-gray-200 pt-6 mt-6">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Release Year: <span className="text-[#3498db] font-bold">{book?.year}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Book Tabs Section */}
          <div className="px-8 pb-8">
            <BookTabs
              loadingBookReview={loadingBookReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              book={book}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;