import { isValidObjectId } from "mongoose";
import createHttpError from "../utils/httpError.js";

const BOOK_FIELDS = ["name", "author", "image", "year", "genre", "detail"];
const CURRENT_YEAR = new Date().getFullYear();

const ensureAllowedFields = (payload, allowedFields) => {
  const unknownFields = Object.keys(payload).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    throw createHttpError(400, "Unknown fields in request", {
      fields: unknownFields,
    });
  }
};

const validateObjectId = (value, fieldName) => {
  if (!isValidObjectId(value)) {
    throw createHttpError(400, `Invalid ${fieldName}`);
  }
};

const validateBookPayload = (payload) => {
  ensureAllowedFields(payload, BOOK_FIELDS);

  const name = payload.name?.trim();
  const author = payload.author?.trim();
  const image = payload.image?.trim();
  const detail = payload.detail?.trim();
  const year = Number(payload.year);
  const genre = payload.genre;

  if (!name || !author || !image || !detail || !genre || Number.isNaN(year)) {
    throw createHttpError(400, "All book fields are required");
  }

  if (!Number.isInteger(year) || year < 0 || year > CURRENT_YEAR + 1) {
    throw createHttpError(400, "Please provide a valid publication year");
  }

  validateObjectId(genre, "genre id");

  return {
    name,
    author,
    image,
    year,
    genre,
    detail,
  };
};

const validateReviewPayload = (payload) => {
  ensureAllowedFields(payload, ["rating", "comment"]);

  const rating = Number(payload.rating);
  const comment = payload.comment?.trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw createHttpError(400, "Rating must be an integer between 1 and 5");
  }

  if (!comment) {
    throw createHttpError(400, "Comment is required");
  }

  return {
    rating,
    comment,
  };
};

const validateDeleteCommentPayload = (payload) => {
  ensureAllowedFields(payload, ["bookId", "reviewId"]);

  const { bookId, reviewId } = payload;

  if (!bookId || !reviewId) {
    throw createHttpError(400, "bookId and reviewId are required");
  }

  validateObjectId(bookId, "book id");
  validateObjectId(reviewId, "review id");

  return { bookId, reviewId };
};

export {
  validateBookPayload,
  validateDeleteCommentPayload,
  validateObjectId,
  validateReviewPayload,
};
