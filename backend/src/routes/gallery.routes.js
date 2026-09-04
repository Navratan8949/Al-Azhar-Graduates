const express = require("express");
const { createGalleryItem, getAllGalleryItems, getGalleryItemById, updateGalleryItem, deleteGalleryItem } = require("../controllers/gallery.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

// Public routes
router.get("/", getAllGalleryItems);           // ?type=photo|video  &category=Education
router.get("/:id", getGalleryItemById);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), createGalleryItem);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), updateGalleryItem);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteGalleryItem);

module.exports = router;
