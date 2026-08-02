const User = require("../models/User");

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalProviders = await User.countDocuments({ role: "provider" });
    const pendingCount = await User.countDocuments({
      role: "provider",
      status: "pending",
    });
    const approvedCount = await User.countDocuments({
      role: "provider",
      status: "approved",
    });
    const rejectedCount = await User.countDocuments({
      role: "provider",
      status: "rejected",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProviders,
        pendingCount,
        approvedCount,
        rejectedCount,
      },
    });
  } catch (error) {
    console.error("GET /admin/stats Error:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch dashboard stats",
        error: error.message,
      });
  }
};

/**
 * @desc    Get All Providers (Supports Search, Status/Category Filtering, & Pagination)
 * @route   GET /api/admin/providers
 * @access  Private/Admin
 */
const getAllProviders = async (req, res) => {
  try {
    const { status, search, category, page = 1, limit = 10 } = req.query;

    let query = { role: "provider" };

    // 1. Filter by Status (pending, approved, rejected)
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    // 2. Filter by Category
    if (category) {
      query.category = { $in: [category] };
    }

    // 3. Search by Provider Name or Email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination calculations
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const providers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      count: providers.length,
      data: providers,
    });
  } catch (error) {
    console.error("GET /admin/providers Error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch providers", error: error.message });
  }
};

/**
 * @desc    Get Specific Provider Application Details
 * @route   GET /api/admin/providers/:id
 * @access  Private/Admin
 */
const getProviderDetails = async (req, res) => {
  try {
    const provider = await User.findOne({
      _id: req.params.id,
      role: "provider",
    }).select("-password");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("GET /admin/providers/:id Error:", error);
    res
      .status(500)
      .json({
        message: "Error fetching provider details",
        error: error.message,
      });
  }
};

/**
 * @desc    Approve or Reject Provider Application with Remarks
 * @route   PATCH /api/admin/providers/:id/status
 * @access  Private/Admin
 */
const updateProviderStatus = async (req, res) => {
  try {
    const { status, rejectionRemark } = req.body;

    // Validate incoming status payload
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be either 'approved' or 'rejected'.",
      });
    }

    // Require rejection remark when rejecting
    if (
      status === "rejected" &&
      (!rejectionRemark || !rejectionRemark.trim())
    ) {
      return res.status(400).json({
        message:
          "A rejection remark is required when rejecting an application.",
      });
    }

    const provider = await User.findOne({
      _id: req.params.id,
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Update status and rejection remark
    provider.status = status;
    provider.rejectionRemark =
      status === "rejected" ? rejectionRemark.trim() : "";

    const updatedProvider = await provider.save();

    res.status(200).json({
      success: true,
      message: `Provider application successfully ${status}`,
      data: {
        id: updatedProvider._id,
        name: updatedProvider.name,
        email: updatedProvider.email,
        status: updatedProvider.status,
        rejectionRemark: updatedProvider.rejectionRemark,
      },
    });
  } catch (error) {
    console.error("PATCH /admin/providers/:id/status Error:", error);
    res
      .status(500)
      .json({ message: "Failed to update status", error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllProviders,
  getProviderDetails,
  updateProviderStatus,
};
