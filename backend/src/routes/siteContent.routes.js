const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");
const { getAllContent, getContentByKey, upsertContent, deleteContent, uploadMedia } = require("../controllers/siteContent.controller");

// Public
router.get("/", getAllContent);
router.get("/:key", getContentByKey);

// Admin only
router.post("/upload", isAuthenticated, authorizeRoles(["admin"]), upload.single("file"), uploadMedia);
router.post("/", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), upsertContent);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), upsertContent);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteContent);

module.exports = router;
