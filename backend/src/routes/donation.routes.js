const express = require("express");
const { createOrder, verifyPayment, getAllDonations, getMyDonations, createManualDonation, verifyManualDonation, getDonationById } = require("../controllers/donation.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const checkOptionalAuth = isAuthenticated.checkOptionalAuth;

const router = express.Router();

router.post("/create-order", checkOptionalAuth, createOrder);
router.post("/verify-payment", checkOptionalAuth, verifyPayment);
router.get("/me", isAuthenticated, getMyDonations);

// Manual Donation Routes
router.post("/manual", checkOptionalAuth, upload.single("paymentProof"), createManualDonation);

// Get single donation by id (public for receipt, but requires valid ID)
router.get("/:id", getDonationById);

// Admin route
router.get("/", isAuthenticated, authorizeRoles(["admin"]), getAllDonations);
router.put("/:id/verify", isAuthenticated, authorizeRoles(["admin"]), verifyManualDonation);

module.exports = router;
