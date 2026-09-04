const mongoose = require("mongoose");
const SiteContent = require("./src/models/SiteContent");
require("dotenv").config();

async function seedSEO() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const seoContent = {
            title: "World Association for Al-Azhar Graduates - India Branch",
            description: "The India Branch works to connect Al-Azhar graduates throughout India and promote Al-Azhar's message of knowledge, moderation, dialogue and service.",
            keywords: "Al-Azhar Graduates, World Association for Al-Azhar Graduates, Al-Azhar India Branch, Islamic Scholarship, Arabic Language Courses, Interfaith Dialogue, Muslim Organization India"
        };

        const result = await SiteContent.findOneAndUpdate(
            { key: "site_seo" },
            { 
                title: "Website SEO Settings",
                content: JSON.stringify(seoContent)
            },
            { upsert: true, new: true }
        );

        console.log("Successfully added/updated site_seo:", result.key);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedSEO();
