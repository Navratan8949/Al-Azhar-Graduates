const express = require("express");
const { createProject, getAllProjects, getProjectById, updateProject, deleteProject } = require("../controllers/project.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), createProject);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), upload.single("image"), updateProject);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteProject);

module.exports = router;
