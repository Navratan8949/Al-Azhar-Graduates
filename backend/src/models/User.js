const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        profileImage: {
            public_id: {
                type: String,
                default: "",
            },
            url: {
                type: String,
                default: "",
            },
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other", ""],
            default: "",
        },

        dob: {
            type: Date,
            default: null,
        },

        state: {
            type: String,
            trim: true,
            default: "",
        },

        district: {
            type: String,
            trim: true,
            default: "",
        },

        address: {
            type: String,
            trim: true,
            default: "",
        },

        userType: {
            // Donor, Supporter, NGO Member (from signup form)
            type: String,
            enum: ["donor", "supporter", "ngo_member", ""],
            default: "",
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: [
                "admin",
                "member",
            ],
            default: "member",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);