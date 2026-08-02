const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "provider-onboarding/documents";
    let allowed_formats = ["jpg", "png", "pdf", "jpeg"];

    if (file.fieldname == "profilePhoto") {
      folder = "provider-onboarding/profiles";
      allowed_formats = ["jpg", "jpeg", "png"];
    }

    return {
      folder: folder,
      allowed_formats: allowed_formats,
      resource_type: "auto",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

module.exports = { cloudinary, storage };
