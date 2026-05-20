import Book from "../models/Book.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import createHttpError from "../utils/httpError.js";
import {
  validateBookPayload,
  validateDeleteCommentPayload,
  validateReviewPayload,
} from "../validation/bookValidation.js";
import {
  buildReviewPayload,
  recalculateReviewStats,
} from "../services/bookService.js";

const createBook = asyncHandler(async (req, res) => {
  const payload = validateBookPayload(req.body);
  const newBook = await Book.create(payload);

  res.status(201).json(newBook);
});

const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

const getSpecificBook = asyncHandler(async (req, res) => {
  const specificBook = await Book.findById(req.params.id);
  if (!specificBook) {
    throw createHttpError(404, "Book not found");
  }

  res.json(specificBook);
});

const updateBook = asyncHandler(async (req, res) => {
  const payload = validateBookPayload(req.body);
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) {
    throw createHttpError(404, "Book not found");
  }

  res.json(updatedBook);
});

const BookReview = asyncHandler(async (req, res) => {
  const { rating, comment } = validateReviewPayload(req.body);
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw createHttpError(404, "Book not found");
  }

  const alreadyReviewed = book.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    throw createHttpError(400, "Book already reviewed");
  }

  book.reviews.push(
    buildReviewPayload({
      rating,
      comment,
      user: req.user,
    })
  );
  recalculateReviewStats(book);

  await book.save();
  res.status(201).json({ message: "Review added" });
});

const deleteBook = asyncHandler(async (req, res) => {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);

  if (!deletedBook) {
    throw createHttpError(404, "Book not found");
  }

  res.json({ message: "Book deleted successfully" });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { bookId, reviewId } = validateDeleteCommentPayload(req.body);
  const book = await Book.findById(bookId);

  if (!book) {
    throw createHttpError(404, "Book not found");
  }

  const reviewIndex = book.reviews.findIndex(
    (review) => review._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    throw createHttpError(404, "Comment not found");
  }

  book.reviews.splice(reviewIndex, 1);
  recalculateReviewStats(book);

  await book.save();
  res.json({ message: "Comment deleted successfully" });
});

const getNewBooks = asyncHandler(async (req, res) => {
  const newBooks = await Book.find().sort({ createdAt: -1 }).limit(10);
  res.json(newBooks);
});

const getTopBooks = asyncHandler(async (req, res) => {
  const topRatedBooks = await Book.find()
    .sort({ rating: -1, numReviews: -1 })
    .limit(10);
  res.json(topRatedBooks);
});

const getRandomBooks = asyncHandler(async (req, res) => {
  const randomBooks = await Book.aggregate([{ $sample: { size: 10 } }]);
  res.json(randomBooks);
});

export {
  createBook,
  getAllBooks,
  getSpecificBook,
  updateBook,
  BookReview,
  deleteBook,
  deleteComment,
  getNewBooks,
  getTopBooks,
  getRandomBooks,
};
