const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
    {
        // Optional user reference if logged in
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // Optional member reference if logged in
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            default: null
        },
        
        // Optional project reference if donated from a specific project page
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null
        },

        // Optional campaign reference if donated from a specific crowdfunding campaign
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crowdfunding",
            default: null
        },

        // For public donations (non-logged in users)
        fullName: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
        phone: { type: String, trim: true },

        purpose: {
            type: String,
            trim: true,
            default: "General Fund"
        },

        amount: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String, // 'online' (Razorpay) or 'manual' (UPI/Bank Transfer)
            required: true,
        },

        upiId: {
            type: String,
            trim: true,
            default: ""
        },

        paymentId: {
            type: String,
            default: ""
        },

        transactionId: {
            type: String,
            default: "",
        },

        paymentProof: {
            public_id: {
                type: String,
                default: "",
            },
            url: {
                type: String,
                default: "",
            },
        },

        receiptNumber: {
            type: String,
            unique: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "success", "failed", "verified", "rejected"],
            default: "pending",
        },

        message: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Donation", donationSchema);