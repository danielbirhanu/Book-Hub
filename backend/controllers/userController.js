import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/createToken.js";
import createHttpError from "../utils/httpError.js";
import {
  validateLoginInput,
  validateProfileUpdateInput,
  validateRegistrationInput,
} from "../validation/userValidation.js";
import {
  comparePassword,
  hashPassword,
  serializeUser,
} from "../services/userService.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = validateRegistrationInput(req.body);

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw createHttpError(409, "User already exists");
  }

  const newUser = await User.create({
    username,
    email,
    password: await hashPassword(password),
  });

  generateToken(res, newUser._id);

  res.status(201).json(serializeUser(newUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = validateLoginInput(req.body);
  const invalidCredentialsError = createHttpError(
    401,
    "Invalid email or password"
  );

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw invalidCredentialsError;
  }

  const isPasswordValid = await comparePassword(password, existingUser.password);

  if (!isPasswordValid) {
    throw invalidCredentialsError;
  }

  generateToken(res, existingUser._id);

  res.json(serializeUser(existingUser));
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({
    message: "User logged out successfully",
  });
});

const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find({}).select("-password")
    res.json(users)
})

const getCurrentUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    
    if(user){
        res.json(serializeUser(user))
    } else {
        throw createHttpError(404, "User not found")
    }
})

const updateCurrentUserProfile = asyncHandler(async(req, res) => {
    const updates = validateProfileUpdateInput(req.body)
    const user = await User.findById(req.user._id)

    if(!user){
        throw createHttpError(404, "User not found")
    }

    if(updates.email && updates.email !== user.email){
        const existingUser = await User.findOne({ email: updates.email })
        if(existingUser && existingUser._id.toString() !== user._id.toString()){
            throw createHttpError(409, "Email is already in use")
        }
    }

    user.username = updates.username || user.username
    user.email = updates.email || user.email

    if(updates.password){
        user.password = await hashPassword(updates.password)
    }

    const updatedUser = await user.save()

    res.json(serializeUser(updatedUser))
})

export { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile };
