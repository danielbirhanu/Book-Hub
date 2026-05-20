import createHttpError from "../utils/httpError.js";

const notFound = (req, res, next) => {
  next(createHttpError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    error.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  const payload = {
    message: error.message || "Internal server error",
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV !== "production" && error.stack) {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
};

export { notFound, errorHandler };
