const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        designation: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        photo: {
            public_id: { type: String, default: "" },
            url: { type: String, default: "" },
        },

        email: {
            type: String,
            trim: true,
            default: "",
        },

        phone: {
            type: String,
            trim: true,
            default: "",
        },

        website: {
            type: String,
            trim: true,
            default: "",
        },

        socialLinks: {
            facebook: { type: String, default: "" },
            instagram: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            twitter: { type: String, default: "" },
        },

        order: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
