const mongoose = require("mongoose");

// This model stores all admin-editable static page content:
// Founder's Message, Vision & Mission, Objectives, About Us, etc.
const siteContentSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            // Examples: "founder_message", "vision_mission", "objectives",
            //           "about_us", "home_hero", "home_stats"
        },

        title: {
            type: String,
            trim: true,
            default: "",
        },

        content: {
            type: String,
            default: "",
        },

        // For trilingual support — Admin can fill these
        content_hi: {
            type: String,
            default: "",
        },

        content_gu: {
            type: String,
            default: "",
        },

        // Optional image (e.g. Founder's photo)
        image: {
            public_id: { type: String, default: "" },
            url: { type: String, default: "" },
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);
