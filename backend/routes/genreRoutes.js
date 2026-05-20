import express from "express";
const router = express.Router();

// Controllers
import {
  createGenre,
  updateGenre,
  removeGenre,
  listGenres,
  readGenre,
} from "../controllers/genreController.js";

// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router.route("/").post(authenticate, authorizeAdmin, createGenre);
router.route("/:id").put(authenticate, authorizeAdmin, checkId, updateGenre);
router.route("/:id").delete(authenticate, authorizeAdmin, checkId, removeGenre);
router.route("/genres").get(listGenres);
router.route("/:id").get(checkId, readGenre);

export default router;
