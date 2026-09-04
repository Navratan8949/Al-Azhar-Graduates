const Newsletter = require("../models/Newsletter");

// Public — Subscribe to newsletter
exports.subscribe = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: "You are already subscribed!" });
        }

        await Newsletter.create({ email, name });
        res.status(201).json({ success: true, message: "Subscribed successfully! Thank you." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Get all subscribers
exports.getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ isActive: true }).sort("-createdAt");
        res.status(200).json({ success: true, count: subscribers.length, subscribers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Delete / Unsubscribe
exports.deleteSubscriber = async (req, res) => {
    try {
        await Newsletter.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Subscriber removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Send mass email to all subscribers
exports.sendMassNewsletter = async (req, res) => {
    try {
        const { subject, html } = req.body;
        
        if (!subject || !html) {
            return res.status(400).json({ success: false, message: "Subject and HTML content are required." });
        }

        // Fetch all active subscribers
        const subscribers = await Newsletter.find({ isActive: true });
        
        if (!subscribers || subscribers.length === 0) {
            return res.status(404).json({ success: false, message: "No active subscribers found." });
        }

        // Extract emails into an array
        const emails = subscribers.map(sub => sub.email);

        // Import the utility
        const { SendMassEmail } = require("../utils/sendMail");

        // Send the email
        await SendMassEmail(emails, subject, html);

        res.status(200).json({ success: true, message: `Newsletter sent successfully to ${emails.length} subscribers!` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
