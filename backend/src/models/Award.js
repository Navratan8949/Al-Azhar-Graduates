const mongoose = require("mongoose");

const awardSchema = new mongoose.Schema(
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

        awardedBy: {
            type: String,
            trim: true,
            default: "",
        },

        year: {
            type: Number,
            required: true,
        },

        image: {
            public_id: { type: String, default: "" },
            url: { type: String, default: "" },
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

module.exports = mongoose.model("Award", awardSchema);
