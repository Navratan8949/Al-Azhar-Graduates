const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        type: {
            type: String,
            enum: ["photo", "video"],
            required: true,
        },

        image: {
            public_id: {
                type: String,
                default: "",
            },
            url: {
                type: String,
                default: "",
            },
        },

        videoUrl: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            trim: true,
            default: "",
            // e.g. Education, Healthcare, Environment, Food & Nutrition, Community, Events
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Gallery", gallerySchema);