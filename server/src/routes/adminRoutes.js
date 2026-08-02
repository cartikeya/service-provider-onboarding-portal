const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  getDashboardStats,
  getAllProviders,
  getProviderDetails,
  updateProviderStatus,
} = require("../controllers/adminController");

router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getDashboardStats);

router.get("/providers", getAllProviders);
router.get("/providers/:id", getProviderDetails);
router.patch("/providers/:id/status", updateProviderStatus);

module.exports = router;
