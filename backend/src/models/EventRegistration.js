const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: false, // Now optional for public registrations
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        
        mobile: {
            type: String,
            required: true,
            trim: true,
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        status: {
            type: String,
            enum: ["registered", "approved", "cancelled"],
            default: "registered",
        },

        remarks: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "EventRegistration",
    eventRegistrationSchema
);