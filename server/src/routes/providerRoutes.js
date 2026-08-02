const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  getProviderProfile,
  updateProviderProfile,
} = require("../controllers/providerController");

const upload = require("../middlewares/uploadMiddleware");

router.use(protect);
router.use(authorize("provider"));

router.get("/profile", getProviderProfile);
router.put(
  "/profile",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  updateProviderProfile,
);
module.exports = router;
