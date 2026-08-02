const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6 },
    role: { type: String, enum: ["provider", "admin"], default: "provider" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionRemark: { type: String, default: "" },
    // Profile Data
    category: [String],
    skills: [String],
    experienceYears: Number,
    location: {
      city: String,
      state: String,
      address: String,
    },
    profilePhoto: String, // Image URL
    documents: [
      {
        docType: String, // e.g., 'ID Proof', 'Certification'
        fileUrl: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
