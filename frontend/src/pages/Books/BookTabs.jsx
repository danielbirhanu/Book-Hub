import { Link } from "react-router-dom";

const BookTabs = ({ userInfo, submitHandler, comment, setComment, book, rating, setRating }) => {
  return (
    <div className="mt-8">
      {/* Review Form Section */}
      <section className="bg-gray-50 p-6 rounded-xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Share Your Thoughts</h2>
        
        {userInfo ? (
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="rating" className="block text-lg font-medium text-gray-700">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    {rating >= star ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="block text-lg font-medium text-gray-700">
                Your Review
              </label>
              <textarea
                id="comment"
                rows="4"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Share your thoughts about this book..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <p className="text-lg text-gray-600 mb-4">Please sign in to write a review</p>
            <Link 
              to="/login" 
              className="inline-flex items-center text-[#3498db] hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Sign In
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Reader Reviews
          {book?.reviews && book.reviews.length > 0 && (
            <span className="ml-2 text-indigo-600 bg-indigo-100 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {book.reviews.length}
            </span>
          )}
        </h2>

        <div className="space-y-6">
          {book?.reviews.length === 0 ? (
            <div className="text-center py-10">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            book?.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-50 p-6 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 text-indigo-800 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3">
                      {review.name.charAt(0)}
                    </div>
                    <strong className="text-gray-800">{review.name}</strong>
                  </div>
                  <p className="text-sm text-gray-500">
                    {review.createdAt.substring(0, 10)}
                  </p>
                </div>

                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${review.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default BookTabs;