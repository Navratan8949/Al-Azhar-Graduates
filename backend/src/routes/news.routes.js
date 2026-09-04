const express = require("express");
const { createNews, getAllNews, getNewsById, updateNews, deleteNews } = require("../controllers/news.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/", getAllNews);
router.get("/:id", getNewsById);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), createNews);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), updateNews);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteNews);

module.exports = router;
