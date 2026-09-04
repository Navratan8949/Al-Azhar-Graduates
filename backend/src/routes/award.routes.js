const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");
const { getAllAwards, createAward, updateAward, deleteAward } = require("../controllers/award.controller");

// Public
router.get("/", getAllAwards);

// Admin only
router.post("/", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), createAward);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), updateAward);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteAward);

module.exports = router;
