const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
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

        category: {
            type: String,
            enum: ["fatwa", "book", "article", "document", "report", "other"],
            default: "document",
        },

        file: {
            public_id: { type: String, default: "" },
            url: { type: String, required: true },
        },

        fileType: {
            type: String,
            default: "pdf",
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

module.exports = mongoose.model("Download", downloadSchema);
