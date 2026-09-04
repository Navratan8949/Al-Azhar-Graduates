const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");
const { getAllDownloads, createDownload, updateDownload, deleteDownload } = require("../controllers/download.controller");

// Public
router.get("/", getAllDownloads);

// Admin only
router.post("/", isAuthenticated, authorizeRoles(["admin"]), upload.single("file"), createDownload);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), updateDownload);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteDownload);

module.exports = router;
