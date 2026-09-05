const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadLocalFile } = require("../utils/fileUpload");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: "30d",
    });
};

exports.setupFirstAdmin = async (req, res) => {
    try {
        const adminCount = await User.countDocuments({ role: "admin" });
        if (adminCount > 0) {
            return res.status(403).json({ success: false, message: "Admin already exists. Please use normal login/registration." });
        }

        const { fullName, email, mobile, password } = req.body;
        if (!fullName || !email || !mobile || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profileImage = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                profileImage = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const user = await User.create({
            fullName,
            email,
            mobile,
            password: hashedPassword,
            role: "admin",
            profileImage,
        });

        res.status(201).json({ success: true, message: "First Admin created successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { fullName, email, mobile, password, role, gender, dob, state, district, address, userType } = req.body;

        if (!fullName || !email || !mobile || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User with this email or mobile already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Prevent arbitrary role assignment by default registration
        let assignedRole = "member";
        if (req.user && req.user.role === "admin" && role) {
            assignedRole = role;
        }

        let profileImage = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                profileImage = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const user = await User.create({
            fullName,
            email,
            mobile,
            password: hashedPassword,
            role: assignedRole,
            profileImage,
            gender: gender || "",
            dob: dob || null,
            state: state || "",
            district: district || "",
            address: address || "",
            userType: userType || "",
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                userType: user.userType,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.memberLogin = async (req, res) => {
    try {
        const { emailOrMobile, password } = req.body;

        if (!emailOrMobile || !password) {
            return res.status(400).json({ success: false, message: "Please provide email/mobile and password" });
        }

        const user = await User.findOne({
            $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Members only
        if (user.role !== "member") {
            return res.status(403).json({ success: false, message: "Please use the admin login portal" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: "Account has been deactivated" });
        }

        user.lastLogin = Date.now();
        await user.save();

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { emailOrMobile, password } = req.body;

        if (!emailOrMobile || !password) {
            return res.status(400).json({ success: false, message: "Please provide email/mobile and password" });
        }

        const user = await User.findOne({
            $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Only allow staff/admin roles
        const adminRoles = ["admin"];
        if (!adminRoles.includes(user.role)) {
            return res.status(403).json({ success: false, message: "Access denied. You are not an admin/staff." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: "Account has been deactivated" });
        }

        user.lastLogin = Date.now();
        await user.save();

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, mobile, gender, dob, state, district, address } = req.body;
        const updateData = {};
        if (fullName !== undefined) updateData.fullName = fullName;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (gender !== undefined) updateData.gender = gender;
        if (dob !== undefined) updateData.dob = dob;
        if (state !== undefined) updateData.state = state;
        if (district !== undefined) updateData.district = district;
        if (address !== undefined) updateData.address = address;

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true }).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide both current and new passwords" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
