const mongoose = require("mongoose");

const appointmentLetterSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },

        letterNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        designation: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: String,
            trim: true,
            default: "",
        },

        joiningDate: {
            type: Date,
            required: true,
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
            enum: ["active", "expired", "cancelled"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "AppointmentLetter",
    appointmentLetterSchema
);