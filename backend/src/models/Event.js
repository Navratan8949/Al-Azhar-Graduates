const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
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

        location: {
            type: String,
            required: true,
            trim: true,
        },

        eventDate: {
            type: Date,
            required: true,
        },

        registrationLastDate: {
            type: Date,
        },

        maxParticipants: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
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

module.exports = mongoose.model("Event", eventSchema);