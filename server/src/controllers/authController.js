const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const isMatch = await bcrypt.compare(password, user.password);
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

const googleAuth = async (req, res) => {
  try {
    const { credential, role = "provider" } = req.body;

    if (!credential) {
      return res
        .status(400)
        .json({ message: "Google credential token is required" });
    }

    // 1. Verify Google Credential Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // 2. Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profilePhoto: picture,
        role: role || "provider",
        status: "pending",
      });
    }

    // 3. Issue JWT token
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(400).json({
      success: false,
      message: "Google authentication failed",
      error: error.message,
    });
  }
};

module.exports = { register, login, googleAuth };
