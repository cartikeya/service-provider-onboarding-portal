const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const PORT = 3000;
const cors = require("cors");
app.use(cors({ origin: "*" }));
app.use(express.json());
require("dotenv").config();
const bcrypt = require("bcrypt");
const authRoutes = require("./src/routes/authRoutes");
const providerRoutes = require("./src/routes/providerRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGODB connected"))
  .catch((err) => {
    console.log(err.message);
    console.log("Error:", JSON.stringify(err, null, 2));
  });

app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR CATCH-ALL:");
  console.error(err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message || err,
  });
});
app.listen(PORT, () => console.log(`$server running on localhost ${PORT}`));
