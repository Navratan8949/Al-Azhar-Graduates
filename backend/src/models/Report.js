const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["annual", "audit", "activity", "financial"],
            required: true,
        },

        year: {
            type: Number,
            required: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        pdf: {
            public_id: {
                type: String,
                default: "",
            },
            url: {
                type: String,
                default: "",
            },
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

module.exports = mongoose.model("Report", reportSchema);