const multer = require("multer");
const { storage } = require("../config/cloudinary");

const fileFilter = async (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG, and PDF files are allowed!"),
      false,
    );
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
