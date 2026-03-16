import Genre from "../models/Genre.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import createHttpError from "../utils/httpError.js";
import { validateGenrePayload } from "../validation/genreValidation.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createGenre = asyncHandler(async (req, res) => {
  const { name } = validateGenrePayload(req.body);
  const escapedName = escapeRegex(name);

  const existingGenre = await Genre.findOne({
    name: { $regex: `^${escapedName}$`, $options: "i" },
  });

  if (existingGenre) {
    throw createHttpError(409, "Genre already exists");
  }

  const genre = await Genre.create({ name });
  res.status(201).json(genre);
});

const updateGenre = asyncHandler(async (req, res) => {
  const { name } = validateGenrePayload(req.body);
  const escapedName = escapeRegex(name);
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    throw createHttpError(404, "Genre not found");
  }

  const duplicateGenre = await Genre.findOne({
    _id: { $ne: req.params.id },
    name: { $regex: `^${escapedName}$`, $options: "i" },
  });

  if (duplicateGenre) {
    throw createHttpError(409, "Genre already exists");
  }

  genre.name = name;

  const updatedGenre = await genre.save();
  res.json(updatedGenre);
});

const removeGenre = asyncHandler(async (req, res) => {
  const removed = await Genre.findByIdAndDelete(req.params.id);

  if (!removed) {
    throw createHttpError(404, "Genre not found");
  }

  res.json(removed);
});

const listGenres = asyncHandler(async (req, res) => {
  const all = await Genre.find({});
  res.json(all);
});

const readGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    throw createHttpError(404, "Genre not found");
  }

  res.json(genre);
});

export { createGenre, updateGenre, removeGenre, listGenres, readGenre };
