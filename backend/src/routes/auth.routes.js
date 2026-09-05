const express = require("express");
const { register, memberLogin, adminLogin, logout, getMe, setupFirstAdmin, updateProfile, updatePassword } = require("../controllers/auth.controller");
const isAuthenticated = require("../middleware/auth");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/setup-admin", upload.single("profileImage"), setupFirstAdmin);
router.post("/register", upload.single("profileImage"), register);
router.post("/login/member", memberLogin);
router.post("/login/admin", adminLogin);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMe);
router.put("/profile", isAuthenticated, updateProfile);
router.put("/password", isAuthenticated, updatePassword);

module.exports = router;
