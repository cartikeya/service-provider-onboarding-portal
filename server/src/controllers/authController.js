const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedpassword,
    role: role || "provider",
  });
  const token = generateToken(user._id, user.role);
  return res.status(201).json({
    message: "user registered successfully",
    token,
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = generateToken(user._id, user.role);
    return res.status(201).json({ message: "Logged in", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { register, login };
