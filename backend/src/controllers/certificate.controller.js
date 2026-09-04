const Certificate = require("../models/Certificate");
const Member = require("../models/Member");
const { uploadLocalFile, deleteLocalFile } = require("../utils/fileUpload");
const { generateCertificatePDF } = require("../utils/generatePDF");
const { SendVerificationCode } = require("../utils/sendMail");
const { getSiteName } = require("../utils/siteSettings");
const path = require("path");
const fs = require("fs");

exports.createCertificate = async (req, res) => {
    try {
        const { member, memberId, certificateNo, title, description, status } = req.body;
        const actualMemberId = member || memberId;

        const memberDoc = await Member.findById(actualMemberId).populate("user");
        if (!memberDoc) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        const userName = memberDoc.user ? memberDoc.user.fullName : "Member";
        const siteName = await getSiteName();

        let pdf = { public_id: "", url: "" };
        const pdfPath = await generateCertificatePDF({ certificateNo, title, description }, userName, siteName);
        
        if (pdfPath) {
            const fileName = path.basename(pdfPath);
            const localUrl = `${req.protocol}://${req.get("host")}/public/certificates/${fileName}`;
            pdf = { public_id: fileName, url: localUrl };
        }

        const certificate = await Certificate.create({
            member: actualMemberId,
            certificateNo,
            title,
            description,
            status,
            pdf
        });

        memberDoc.certificate.push(certificate._id);
        await memberDoc.save();

        const populatedCertificate = await Certificate.findById(certificate._id).populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        });

        // Send Email Notification
        if (populatedCertificate.member && populatedCertificate.member.user && populatedCertificate.member.user.email) {
            const userEmail = populatedCertificate.member.user.email;
            const userName = populatedCertificate.member.user.fullName;
            SendVerificationCode(
                userEmail,
                `<p>Dear ${userName},</p><p>We are delighted to inform you that you have been awarded a new certificate: "<strong>${title}</strong>".</p><p>Description: ${description}</p><p>You can view and download your certificate from your Member Dashboard.</p><p>Thank you for your continuous support!</p><p>Best Regards,<br/>${siteName} Team</p>`,
                `Congratulations! You have received a new Certificate - ${siteName}`,
                `Dear ${userName},\n\nWe are delighted to inform you that you have been awarded a new certificate: "${title}".\n\nDescription: ${description}\n\nYou can view and download your certificate from your Member Dashboard.\n\nThank you for your continuous support!\n\nBest Regards,\n${siteName} Team`
            );
        }

        res.status(201).json({ success: true, certificate: populatedCertificate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find().populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        }).sort("-issueDate");
        res.status(200).json({ success: true, count: certificates.length, certificates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyCertificates = async (req, res) => {
    try {
        const member = await Member.findOne({ user: req.user.id });
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        const certificates = await Certificate.find({ member: member._id }).sort("-issueDate");
        res.status(200).json({ success: true, count: certificates.length, certificates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) return res.status(404).json({ success: false, message: "Certificate not found" });

        const { member, memberId, certificateNo, title, description, status } = req.body;
        const actualMemberId = member || memberId;

        const memberDoc = await Member.findById(actualMemberId).populate("user");
        const userName = memberDoc && memberDoc.user ? memberDoc.user.fullName : "Member";
        const siteName = await getSiteName();

        let pdf = certificate.pdf;
        // Always regenerate if updated
        const pdfPath = await generateCertificatePDF({ certificateNo, title, description }, userName, siteName);
        if (pdfPath) {
            const fileName = path.basename(pdfPath);
            const localUrl = `${req.protocol}://${req.get("host")}/public/certificates/${fileName}`;
            
            // Delete old PDF from local storage if exists
            if (pdf && pdf.public_id) {
                const oldPath = path.join(__dirname, "..", "..", "public", "certificates", pdf.public_id);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            pdf = { public_id: fileName, url: localUrl };
        }

        const updatedCertificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            { member: actualMemberId || certificate.member, certificateNo, title, description, status, pdf },
            { new: true }
        );

        const populatedCertificate = await Certificate.findById(updatedCertificate._id).populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        });

        res.status(200).json({ success: true, certificate: populatedCertificate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) return res.status(404).json({ success: false, message: "Certificate not found" });

        // Remove from Member array
        await Member.updateOne(
            { _id: certificate.member },
            { $pull: { certificate: certificate._id } }
        );

        // Delete the local PDF file
        if (certificate.pdf && certificate.pdf.public_id) {
            const oldPath = path.join(__dirname, "..", "..", "public", "certificates", certificate.pdf.public_id);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await certificate.deleteOne();
        res.status(200).json({ success: true, message: "Certificate deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
