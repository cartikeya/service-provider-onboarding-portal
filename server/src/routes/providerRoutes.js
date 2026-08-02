const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/authMiddleware");
const { getProviderProfile } = require("../controllers/providerController");

router.use(protect);
router.use(authorize("provider"));

router.get("/profile", getProviderProfile);
// router.put;
module.exports = router;
