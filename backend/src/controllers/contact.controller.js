const Contact = require("../models/Contact");

exports.submitContactEnquiry = async (req, res) => {
    try {
        const { name, email, mobile, subject, message } = req.body;

        const enquiry = await Contact.create({
            name,
            email,
            mobile,
            subject,
            message
        });

        res.status(201).json({ success: true, message: "Enquiry submitted successfully. We will get back to you soon.", enquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Contact.find().sort("-createdAt");
        res.status(200).json({ success: true, count: enquiries.length, enquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEnquiryById = async (req, res) => {
    try {
        const enquiry = await Contact.findById(req.params.id);
        if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });
        res.status(200).json({ success: true, enquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const enquiry = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found" });

        res.status(200).json({ success: true, message: "Enquiry status updated", enquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
