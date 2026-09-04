const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
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

        category: {
            type: String,
            enum: ["news", "press_release", "article", "interview", "event_report"],
            default: "news",
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "published",
        },

        publishedAt: {
            type: Date,
            default: Date.now,
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

module.exports = mongoose.model("News", newsSchema);