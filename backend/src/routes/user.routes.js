const express = require("express");
const { getAllUsers } = require("../controllers/user.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Allow admins to view public web users
router.get("/public", isAuthenticated, authorizeRoles(["admin"]), getAllUsers);

module.exports = router;
