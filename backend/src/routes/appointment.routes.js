const express = require("express");
const { createAppointmentLetter, getAllAppointmentLetters, getMyAppointmentLetters } = require("../controllers/appointment.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

router.get("/me", isAuthenticated, getMyAppointmentLetters);

// Admin / Manager routes
router.get("/", isAuthenticated, authorizeRoles(["admin"]), getAllAppointmentLetters);
router.post("/", isAuthenticated, authorizeRoles(["admin"]), createAppointmentLetter);

module.exports = router;
