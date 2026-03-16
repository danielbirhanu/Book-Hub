import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";
import createHttpError from "../utils/httpError.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!process.env.JWT_SECRET) {
    throw createHttpError(500, "Server authentication is not configured");
  }

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw createHttpError(401, "Not authorized");
    }

    req.user = user;
    return next();
  }

  throw createHttpError(401, "Not authorized");
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return next(createHttpError(403, "Not authorized as an admin"));
};

export { authenticate, authorizeAdmin };
