import createHttpError from "../utils/httpError.js";

const validateGenrePayload = (payload) => {
  const unknownFields = Object.keys(payload).filter((field) => field !== "name");

  if (unknownFields.length > 0) {
    throw createHttpError(400, "Unknown fields in request", {
      fields: unknownFields,
    });
  }

  const name = payload.name?.trim();

  if (!name) {
    throw createHttpError(400, "Genre name is required");
  }

  if (name.length > 32) {
    throw createHttpError(400, "Genre name must be 32 characters or fewer");
  }

  return { name };
};

export { validateGenrePayload };
