import express from "express";
const router = express.Router();

// Controllers
import {
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
} from "../controllers/bookController.js";
// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Public Routes
router.get("/all-Books", getAllBooks);
router.get("/specific-Book/:id", getSpecificBook);
router.get("/new-Books", getNewBooks);
router.get("/top-Books", getTopBooks);
router.get("/random-Books", getRandomBooks);

// Restricted Routes
router.post("/:id/reviews", authenticate, checkId, BookReview);

// Admin
router.post("/create-Book", authenticate, authorizeAdmin, createBook);
router.put("/update-Book/:id", authenticate, authorizeAdmin, updateBook);
router.delete("/delete-Book/:id", authenticate, authorizeAdmin, deleteBook);
router.delete("/delete-comment", authenticate, authorizeAdmin, deleteComment);

export default router;