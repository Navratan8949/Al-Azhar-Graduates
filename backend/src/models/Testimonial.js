const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        designation: {
            type: String,
            default: "",
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

        message: {
            type: String,
            required: true,
            trim: true,
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);