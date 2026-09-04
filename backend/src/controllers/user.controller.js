const User = require("../models/User");

// Get all users (public members list or for admin views)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" })
            .select("-password")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
