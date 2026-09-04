const mongoose = require("mongoose");

const crowdfundingSchema = new mongoose.Schema(
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

        targetAmount: {
            type: Number,
            required: true,
        },

        raisedAmount: {
            type: Number,
            default: 0,
        },

        startDate: {
            type: Date,
        },

        endDate: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["active", "completed", "closed"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Crowdfunding", crowdfundingSchema);