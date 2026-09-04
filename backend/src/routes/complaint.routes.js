const express = require("express");
const { raiseComplaint, getMyComplaints, getAllComplaints, getComplaintById, resolveComplaint } = require("../controllers/complaint.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Member routes
router.post("/", isAuthenticated, raiseComplaint);
router.get("/me", isAuthenticated, getMyComplaints);

// Admin / Manager routes
router.get("/", isAuthenticated, authorizeRoles(["admin"]), getAllComplaints);
router.get("/:id", isAuthenticated, authorizeRoles(["admin"]), getComplaintById);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), resolveComplaint);

module.exports = router;
