const express = require("express");
const { getDashboardStats } = require("../controllers/dashboard.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Admin / Manager / Coordinator routes
router.get("/stats", isAuthenticated, authorizeRoles(["admin"]), getDashboardStats);

module.exports = router;
