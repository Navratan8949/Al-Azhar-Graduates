const Complaint = require("../models/Complaint");
const Member = require("../models/Member");
const { SendVerificationCode } = require("../utils/sendMail");
const { getSiteName } = require("../utils/siteSettings");

exports.raiseComplaint = async (req, res) => {
    try {
        const { subject, message } = req.body;
        
        const member = await Member.findOne({ user: req.user.id });
        if (!member) {
            return res.status(403).json({ success: false, message: "Member profile not found" });
        }

        const complaint = await Complaint.create({
            member: member._id,
            subject,
            message,
            status: "pending"
        });

        res.status(201).json({ success: true, message: "Complaint submitted successfully", complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyComplaints = async (req, res) => {
    try {
        const member = await Member.findOne({ user: req.user.id });
        if (!member) {
            return res.status(403).json({ success: false, message: "Member profile not found" });
        }

        const complaints = await Complaint.find({ member: member._id }).sort("-createdAt");
        res.status(200).json({ success: true, count: complaints.length, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate({
            path: "member",
            populate: { path: "user", select: "fullName email mobile" }
        }).sort("-createdAt");
        
        res.status(200).json({ success: true, count: complaints.length, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate({
            path: "member",
            populate: { path: "user", select: "fullName email mobile" }
        }).populate("resolvedBy", "fullName email role");

        if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
        res.status(200).json({ success: true, complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resolveComplaint = async (req, res) => {
    try {
        const { status, reply } = req.body;
        const complaint = await Complaint.findById(req.params.id).populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        });

        if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

        complaint.status = status || complaint.status;
        complaint.reply = reply || complaint.reply;
        
        if (status === "resolved" || status === "closed") {
            complaint.resolvedBy = req.user.id;
            complaint.resolvedAt = Date.now();
        }

        await complaint.save();

        // Send Email Notification
        if (complaint.member && complaint.member.user && complaint.member.user.email) {
            const userEmail = complaint.member.user.email;
            const userName = complaint.member.user.fullName;
            const siteName = await getSiteName();
            try {
                SendVerificationCode(
                    userEmail,
                    `<p>Dear ${userName},</p><p>Your complaint regarding "<strong>${complaint.subject}</strong>" has been updated to "<strong>${status}</strong>".</p><p><strong>Admin Reply:</strong><br/>${reply || "No additional remarks."}</p><p>If you have any further issues, please reach out to us.</p><p>Best Regards,<br/>${siteName} Support Team</p>`,
                    `Update on your Complaint: ${complaint.subject} - ${siteName}`,
                    `Dear ${userName},\n\nYour complaint regarding "${complaint.subject}" has been updated to "${status}".\n\nAdmin Reply:\n${reply || "No additional remarks."}\n\nIf you have any further issues, please reach out to us.\n\nBest Regards,\n${siteName} Support Team`
                );
            } catch (emailError) {
                console.error("Error sending complaint update email:", emailError);
            }
        }

        res.status(200).json({ success: true, message: "Complaint updated successfully", complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
