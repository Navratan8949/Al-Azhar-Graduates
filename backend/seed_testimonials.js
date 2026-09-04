const mongoose = require("mongoose");
const Testimonial = require("./src/models/Testimonial");
require("dotenv").config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing testimonials
        await Testimonial.deleteMany({});

        const testimonials = [
            {
                name: "Dr. Ayesha Rahman",
                designation: "Healthcare Professional",
                message: "The medical camps organized by the association have been a lifeline for many remote villages. I have witnessed firsthand the impact of their dedication to providing free and accessible healthcare.",
                rating: 5,
                status: "active",
                image: { url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" }
            },
            {
                name: "Mr. Ramesh Patel",
                designation: "Community Leader",
                message: "Their rural education initiative transformed our village. The children now have access to digital learning tools, and the coaching centres are giving them the bright future they deserve.",
                rating: 5,
                status: "active",
                image: { url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" }
            },
            {
                name: "Fatima Sheikh",
                designation: "Volunteer",
                message: "Working with the relief and welfare programs has been an eye-opening experience. The speed at which they deliver ration kits during emergencies is truly commendable. Proud to be a part of this.",
                rating: 5,
                status: "active",
                image: { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" }
            }
        ];

        await Testimonial.insertMany(testimonials);
        console.log("Successfully seeded 3 Testimonials.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
