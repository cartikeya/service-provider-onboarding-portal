const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const PORT = 3000;
app.use(express.json());
require("dotenv").config();
const bcrypt = require("bcrypt");
const authRoutes = require("./src/routes/authRoutes");
const providerRoutes = require("./src/routes/providerRoutes");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB connected"))
  .catch((err) => {
    console.log(err.message);
    console.log("Error:", JSON.stringify(err, null, 2));
  });

app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => console.log(`$server running on localhost ${PORT}`));
