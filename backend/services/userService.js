import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

const serializeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  isAdmin: user.isAdmin,
});

export { comparePassword, hashPassword, serializeUser };
