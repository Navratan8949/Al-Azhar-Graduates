const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");
const { createCertificate, getAllCertificates, getMyCertificates, updateCertificate, deleteCertificate } = require("../controllers/certificate.controller");

// Member routes
router.get("/me", isAuthenticated, getMyCertificates);

// Admin routes
router.get("/", isAuthenticated, authorizeRoles(["admin"]), getAllCertificates);
router.post("/", isAuthenticated, authorizeRoles(["admin"]), createCertificate);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), updateCertificate);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteCertificate);

module.exports = router;
