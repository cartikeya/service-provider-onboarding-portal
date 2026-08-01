const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const PORT = 3000;
app.use(express.json());
require("dotenv").config();
const bcrypt = require("bcrypt");
const authRoutes = require("./src/routes/authRoutes");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB connected"))
  .catch((err) => console.log(err));

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => console.log(`$server running on localhost ${PORT}`));
