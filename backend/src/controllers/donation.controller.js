const Donation = require("../models/Donation");
const Member = require("../models/Member");
const Project = require("../models/Project");
const Crowdfunding = require("../models/Crowdfunding");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const pdf = require("pdfkit");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { uploadLocalFile } = require("../utils/fileUpload");
const { getSiteName } = require("../utils/siteSettings");
const { generateReceiptPDF } = require("../utils/generatePDF");

// Initialize Razorpay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "test@gmail.com",
        pass: process.env.EMAIL_PASS || "testpassword",
    },
});

const generateReceiptNumber = () => {
    return "RHT-REC-" + Date.now().toString().slice(-6);
};

exports.createOrder = async (req, res) => {
    try {
        const { amount, paymentMethod, message, fullName, email, phone, purpose, upiId, projectId, campaignId } = req.body;

        let userId = req.user ? req.user.id : null;
        let memberId = null;
        if (userId) {
            const member = await Member.findOne({ user: userId });
            if (member) memberId = member._id;
        }

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: generateReceiptNumber(),
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
        }

        const donation = await Donation.create({
            user: userId,
            member: memberId,
            fullName,
            email,
            phone,
            purpose,
            upiId,
            amount,
            paymentMethod: paymentMethod || "online",
            receiptNumber: options.receipt,
            message,
            paymentId: "pending",
            project: projectId || null,
            campaign: campaignId || null,
        });

        res.status(200).json({ success: true, order, donationId: donation._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mockkeysecret")
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const donation = await Donation.findById(donationId).populate({
                path: "member",
                populate: { path: "user", select: "fullName email" }
            });

            if (!donation) {
                return res.status(404).json({ success: false, message: "Donation record not found" });
            }

            donation.paymentId = razorpay_payment_id;
            donation.paymentStatus = "success";
            await donation.save();

            // If donation is linked to a project, increment raisedAmount
            if (donation.project) {
                await Project.findByIdAndUpdate(donation.project, {
                    $inc: { raisedAmount: donation.amount }
                });
            }

            // If donation is linked to a campaign, increment raisedAmount
            if (donation.campaign) {
                await Crowdfunding.findByIdAndUpdate(donation.campaign, {
                    $inc: { raisedAmount: donation.amount }
                });
            }

            // Generate PDF Receipt
            const donorName = donation.fullName || (donation.member && donation.member.user && donation.member.user.fullName) || "Donor";
            const donorEmail = donation.email || (donation.member && donation.member.user && donation.member.user.email) || "";
            const siteName = await getSiteName();

            const pdfPath = await generateReceiptPDF(donation, donorName, donorEmail, siteName);

            const mailOptions = {
                from: process.env.EMAIL_USER || "test@gmail.com",
                to: donorEmail,
                subject: `Donation Receipt - ${siteName}`,
                html: `<p>Dear ${donorName},</p>
                       <p>Thank you for your generous donation of INR ${donation.amount}/-.</p>
                       <p>Your support is highly appreciated and helps us in our mission.</p>
                       <p>Please find attached your donation receipt for tax exemption purposes (if applicable).</p>
                       <br/>
                       <p>Best Regards,</p>
                       <p>${siteName}</p>`,
                attachments: [
                    {
                        filename: `Receipt-${donation.receiptNumber}.pdf`,
                        path: pdfPath,
                    },
                ],
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error("Error sending email:", emailError);
            }

            res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find().populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        }).populate("project", "title").populate("campaign", "title").sort("-createdAt");

        res.status(200).json({ success: true, count: donations.length, donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyDonations = async (req, res) => {
    try {
        const userId = req.user.id;
        const User = require("../models/User");
        const userObj = await User.findById(userId);
        const member = await Member.findOne({ user: userId });

        const queryOr = [{ user: userId }];
        if (userObj && userObj.email) {
            queryOr.push({ email: userObj.email });
        }
        if (member) {
            queryOr.push({ member: member._id });
        }

        const donations = await Donation.find({ $or: queryOr })
            .populate("project", "title")
            .populate("campaign", "title")
            .sort("-createdAt");

        res.status(200).json({ success: true, count: donations.length, donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createManualDonation = async (req, res) => {
    try {
        const { amount, paymentMethod, transactionId, message, fullName, email, phone, purpose, upiId, projectId, campaignId } = req.body;

        let userId = req.user ? req.user.id : null;
        let memberId = null;
        if (userId) {
            const member = await Member.findOne({ user: userId });
            if (member) memberId = member._id;
        }

        let paymentProof = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                paymentProof = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const donation = await Donation.create({
            user: userId,
            member: memberId,
            fullName,
            email,
            phone,
            purpose,
            upiId,
            amount,
            paymentMethod,
            transactionId,
            receiptNumber: generateReceiptNumber(),
            message,
            paymentId: "manual",
            paymentStatus: "pending",
            paymentProof,
            project: projectId || null,
            campaign: campaignId || null,
        });

        res.status(201).json({ success: true, message: "Manual donation submitted for verification.", donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyManualDonation = async (req, res) => {
    try {
        const { status } = req.body; // "verified" or "rejected"
        const donation = await Donation.findById(req.params.id).populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        });

        if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });

        donation.paymentStatus = status;
        await donation.save();

        if (status === "verified") {
            // Increment project's raisedAmount if linked
            if (donation.project) {
                await Project.findByIdAndUpdate(donation.project, {
                    $inc: { raisedAmount: donation.amount }
                });
            }

            // Increment campaign's raisedAmount if linked
            if (donation.campaign) {
                await Crowdfunding.findByIdAndUpdate(donation.campaign, {
                    $inc: { raisedAmount: donation.amount }
                });
            }

            const donorName = donation.fullName || (donation.member && donation.member.user && donation.member.user.fullName) || "Donor";
            const donorEmail = donation.email || (donation.member && donation.member.user && donation.member.user.email) || "";
            const siteName = await getSiteName();

            // Run PDF generation and email sending in the background (fire and forget)
            // This prevents the UI from freezing while waiting for SMTP and PDF generation
            (async () => {
                try {
                    const pdfPath = await generateReceiptPDF(donation, donorName, donorEmail, siteName);

                    const mailOptions = {
                        from: process.env.EMAIL_USER || "test@gmail.com",
                        to: donorEmail,
                        subject: `Donation Receipt - ${siteName}`,
                        html: `<p>Dear ${donorName},</p>
                               <p>Your offline donation of INR ${donation.amount}/- has been verified!</p>
                               <p>Please find attached your donation receipt for tax exemption purposes (if applicable).</p>
                               <br/>
                               <p>Best Regards,</p>
                               <p>${siteName}</p>`,
                        attachments: [{ filename: `Receipt-${donation.receiptNumber}.pdf`, path: pdfPath }],
                    };
                    await transporter.sendMail(mailOptions);
                } catch (emailError) {
                    console.error("Error sending email or PDF:", emailError);
                }
            })();
        }

        return res.status(200).json({ success: true, message: `Donation ${status}`, donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate("project", "title")
            .populate("campaign", "title");

        if (!donation) {
            return res.status(404).json({ success: false, message: "Donation not found" });
        }

        res.status(200).json({ success: true, donation });
    } catch (error) {
        res.status(500).json({ success: false, message: "Invalid donation ID or server error" });
    }
};
