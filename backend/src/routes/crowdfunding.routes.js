const express = require("express");
const { createCampaign, getAllCampaigns, getCampaignById, updateCampaign, deleteCampaign } = require("../controllers/crowdfunding.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), createCampaign);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), updateCampaign);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteCampaign);

module.exports = router;
