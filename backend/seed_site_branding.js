const mongoose = require("mongoose");
const SiteContent = require("./src/models/SiteContent");
require("dotenv").config();

async function seedSiteName() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const logoContent = {
            logo: "/logo.png",
            favicon: "/favicon.ico",
            siteName: "World Association for Al-Azhar Graduates - India Branch",
            shortName: "World Association for Al-Azhar Graduates"
        };

        const result = await SiteContent.findOneAndUpdate(
            { key: "site_logo" },
            { 
                title: "Site Logo & Branding",
                content: JSON.stringify(logoContent)
            },
            { upsert: true, returnDocument: 'after' }
        );

        console.log("Successfully added/updated site_logo:", result.key);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedSiteName();
