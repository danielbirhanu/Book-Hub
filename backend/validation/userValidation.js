import createHttpError from "../utils/httpError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const ALLOWED_USER_FIELDS = ["username", "email", "password"];

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

const normalizeEmail = (email) => email.trim().toLowerCase();

const validateEmail = (email) => {
  if (!EMAIL_REGEX.test(email)) {
    throw createHttpError(400, "Please provide a valid email address");
  }
};

const validatePassword = (password) => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw createHttpError(
      400,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    );
  }
};

const validateUsername = (username) => {
  if (username.length < 2 || username.length > 50) {
    throw createHttpError(
      400,
      "Username must be between 2 and 50 characters long"
    );
  }
};

const validateRegistrationInput = (payload) => {
  ensureAllowedFields(payload, ALLOWED_USER_FIELDS);

  const username = payload.username?.trim();
  const email = payload.email?.trim();
  const password = payload.password;

  if (!username || !email || !password) {
    throw createHttpError(400, "Please fill all the fields");
  }

  validateUsername(username);
  validateEmail(email);
  validatePassword(password);

  return {
    username,
    email: normalizeEmail(email),
    password,
  };
};

const validateLoginInput = (payload) => {
  ensureAllowedFields(payload, ["email", "password"]);

  const email = payload.email?.trim();
  const password = payload.password;

  if (!email || !password) {
    throw createHttpError(400, "Email and password are required");
  }

  validateEmail(email);

  return {
    email: normalizeEmail(email),
    password,
  };
};

const validateProfileUpdateInput = (payload) => {
  ensureAllowedFields(payload, ALLOWED_USER_FIELDS);

  const updates = {};

  if (payload.username !== undefined) {
    const username = payload.username?.trim();

    if (!username) {
      throw createHttpError(400, "Username cannot be empty");
    }

    validateUsername(username);
    updates.username = username;
  }

  if (payload.email !== undefined) {
    const email = payload.email?.trim();

    if (!email) {
      throw createHttpError(400, "Email cannot be empty");
    }

    validateEmail(email);
    updates.email = normalizeEmail(email);
  }

  if (payload.password !== undefined && payload.password !== "") {
    validatePassword(payload.password);
    updates.password = payload.password;
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "At least one profile field must be updated");
  }

  return updates;
};

export {
  validateLoginInput,
  validateProfileUpdateInput,
  validateRegistrationInput,
};
