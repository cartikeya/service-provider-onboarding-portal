const ImageKit = require("imagekit");
const fs = require("fs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Uploads a file buffer/path to ImageKit and returns the public HTTPS URL
 */
const uploadToImageKit = async (filePath, fileName, folder) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);

    const response = await imagekit.upload({
      file: fileBuffer, // Pass raw file buffer
      fileName: fileName,
      folder: folder, // e.g., "provider-onboarding/profiles"
    });

    // Delete local temporary file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return response.url; // Public HTTPS CDN URL
  } catch (error) {
    // Delete temp file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("ImageKit Upload Error:", error);
    throw error;
  }
};

module.exports = uploadToImageKit;
