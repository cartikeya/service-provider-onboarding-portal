const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const PORT = 3000;
app.use(express.json());
require("dotenv").config();
const bcrypt = require("bcrypt");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.post("/register", async (req, res) => {
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
  return res.status(201).json({
    message: "user registered successfully",
  });
});

app.listen(PORT, () => console.log(`$server running on localhost ${PORT}`));
