const SiteContent = require("../models/SiteContent");

async function getSiteName() {
    try {
        const siteSeo = await SiteContent.findOne({ key: "site_seo" });
        if (siteSeo && siteSeo.content) {
            const parsed = JSON.parse(siteSeo.content);
            if (parsed.title) {
                return parsed.title;
            }
        }
        
        const siteLogo = await SiteContent.findOne({ key: "site_logo" });
        if (siteLogo && siteLogo.content) {
            const parsed = JSON.parse(siteLogo.content);
            if (parsed.siteName) {
                return parsed.siteName;
            }
        }
    } catch (e) {
        console.error("Error fetching site name:", e);
    }
    return process.env.SITE_NAME || "World Association for Al-Azhar Graduates";
}

async function getSiteLogoDetails() {
    try {
        const siteLogo = await SiteContent.findOne({ key: "site_logo" });
        if (siteLogo && siteLogo.content) {
            return JSON.parse(siteLogo.content);
        }
    } catch (e) {
        console.error("Error fetching site logo details:", e);
    }
    return {};
}

module.exports = {
    getSiteName,
    getSiteLogoDetails
};
