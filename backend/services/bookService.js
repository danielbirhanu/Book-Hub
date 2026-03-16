const buildReviewPayload = ({ rating, comment, user }) => ({
  name: user.username,
  rating,
  comment,
  user: user._id,
});

const recalculateReviewStats = (book) => {
  book.numReviews = book.reviews.length;
  book.rating =
    book.reviews.length > 0
      ? book.reviews.reduce((total, review) => total + review.rating, 0) /
        book.reviews.length
      : 0;
};

export { buildReviewPayload, recalculateReviewStats };
