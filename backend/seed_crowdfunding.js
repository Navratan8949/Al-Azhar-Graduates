const mongoose = require("mongoose");
const Crowdfunding = require("./src/models/Crowdfunding");
require("dotenv").config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing campaigns
        await Crowdfunding.deleteMany({});

        const campaigns = [
            {
                title: "Build a Digital Library",
                description: "Help us provide digital tablets and e-books to rural students who lack access to physical libraries.",
                targetAmount: 2000000,
                raisedAmount: 500000,
                status: "active",
                image: { url: "https://images.unsplash.com/photo-1510531704581-5b2870972060?w=800&q=80" },
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
            },
            {
                title: "Winter Clothes Donation Drive",
                description: "Join hands to provide warm clothing and blankets to the homeless during the harsh winter months.",
                targetAmount: 500000,
                raisedAmount: 350000,
                status: "active",
                image: { url: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&q=80" },
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
            },
            {
                title: "Orphanage Renovation Fund",
                description: "Raising funds to repair and upgrade the living facilities for 50 orphan children in our local care center.",
                targetAmount: 1500000,
                raisedAmount: 1200000,
                status: "active",
                image: { url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80" },
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
            }
        ];

        await Crowdfunding.insertMany(campaigns);
        console.log("Successfully seeded 3 Crowdfunding campaigns.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
