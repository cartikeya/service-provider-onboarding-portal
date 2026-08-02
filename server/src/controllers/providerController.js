const User = require("../models/User");
const uploadToImageKit = require("../config/imagekit");

const getProviderProfile = async (req, res) => {
  try {
    const provider = await User.findById(req.user._id).select("-password");
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

const updateProviderProfile = async (req, res) => {
  try {
    const { name, category, skills, experienceYears, location } = req.body;

    const provider = await User.findById(req.user._id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    if (provider.status === "approved") {
      return res.status(400).json({
        message:
          "Your profile is already approved, contact support for changes",
      });
    }

    // Assign text fields
    if (name) provider.name = name;
    if (category)
      provider.category = Array.isArray(category) ? category : [category];
    if (skills) provider.skills = Array.isArray(skills) ? skills : [skills];
    if (experienceYears) provider.experienceYears = Number(experienceYears);

    if (location) {
      try {
        provider.location =
          typeof location === "string" ? JSON.parse(location) : location;
      } catch (e) {
        console.error("Location parse error:", e.message);
      }
    }
    // 1. Upload Profile Photo if present
    if (req.files && req.files.profilePhoto && req.files.profilePhoto[0]) {
      const photoFile = req.files.profilePhoto[0];
      provider.profilePhoto = await uploadToImageKit(
        photoFile.path,
        photoFile.originalname,
        "provider-onboarding/profiles",
      );
    }

    // 2. Upload Documents (PDFs / Images) if present
    if (req.files && req.files.documents && req.files.documents.length > 0) {
      const uploadedDocs = [];

      for (const docFile of req.files.documents) {
        const fileUrl = await uploadToImageKit(
          docFile.path,
          docFile.originalname,
          "provider-onboarding/documents",
        );

        uploadedDocs.push({
          docType: docFile.originalname || "verification document",
          fileUrl: fileUrl,
        });
      }

      provider.documents = uploadedDocs;
    }

    const updatedProvider = await provider.save();

    res.status(200).json({
      success: true,
      message: "Profile updated and submitted for review",
      data: updatedProvider,
    });
  } catch (error) {
    // Expose deep Cloudinary error reasons
    console.error("Detailed Error Message:", error.message);
    console.error("HTTP Code:", error.http_code);

    if (error.error && error.error.message) {
      console.error("Cloudinary Inner Error:", error.error.message);
    }

    res.status(500).json({
      message: "Failed to update profile",
      error: error.message || "Cloudinary Upload Failed",
    });
  }
};

module.exports = { getProviderProfile, updateProviderProfile };
