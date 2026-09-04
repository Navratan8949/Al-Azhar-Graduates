const express = require("express");
const { applyMembership, getAllMembers, approveMember, rejectMember, getMyProfile, createMemberDirectly, verifyPublicMember, updateMemberAdmin, deleteMemberAdmin } = require("../controllers/member.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

// Public route for scanning QR ID cards
router.get("/verify/:memberId", verifyPublicMember);

router.post("/apply", isAuthenticated, upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "alAzharCertificate", maxCount: 1 }
]), applyMembership);

router.get("/me", isAuthenticated, getMyProfile);
router.put("/me", isAuthenticated, upload.single("profileImage"), require("../controllers/member.controller").updateMemberProfile);

// Admin / Manager / Coordinator routes
router.get("/", isAuthenticated, authorizeRoles(["admin"]), getAllMembers);
router.post("/", isAuthenticated, authorizeRoles(["admin"]), createMemberDirectly);
router.put("/:id/approve", isAuthenticated, authorizeRoles(["admin"]), approveMember);
router.put("/:id/reject", isAuthenticated, authorizeRoles(["admin"]), rejectMember);
router.put("/:id", isAuthenticated, authorizeRoles(["admin"]), updateMemberAdmin);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteMemberAdmin);

module.exports = router;
