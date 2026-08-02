const User = require("../models/User");

const getProviderPorfile = async (req, res) => {
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
    const provider = await User.findById(req.user._id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    if (provider.status == "approved") {
      return res.status(400).json({
        message:
          "Your profile is already approved, contact support for changes",
      });
    }

    if (name) provider.name = name;
    if (category)
      provider.category = Array.isArray(category) ? category : [category];
    if (skills) provider.skills = Array.isArray(skills) ? skills : [skills];
    if (experienceYears) provider.experienceYears = Number(experienceYears);
    if (location) {
      provider.location =
        typeof location === "string" ? JSON.parse(location) : location;
    }
    if (req.files && req.files.profilePhoto) {
      provider.profilePhoto =
        req.files.profilePhoto[0].path || req.files.profilePhoto[0].location;
    }
    if (req.files && req.files.documents) {
      const uploadedDocs = req.files.documents.map((file) => ({
        DocType: file.originalname || "verification docment",
        fileUrl: file.path || file.location,
      }));
    }
    const updatedProvider = await User.save();
    res.status(200).json({
      success: true,
      message: "profile updated and submitted for review",
      data: updatedProvider,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

module.exports = { getProviderPorfile, updateProviderProfile };
