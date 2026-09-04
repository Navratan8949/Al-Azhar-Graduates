const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },

        certificateNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
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

        issueDate: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: ["active", "cancelled"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Certificate", certificateSchema);