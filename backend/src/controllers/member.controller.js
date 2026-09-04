const Member = require("../models/Member");
const User = require("../models/User");
const QRCode = require("qrcode");
const { uploadLocalFile, deleteLocalFile } = require("../utils/fileUpload");
const { SendVerificationCode } = require("../utils/sendMail");
const { getSiteName } = require("../utils/siteSettings");
const { generateAndSaveAppointmentLetter } = require("../utils/appointmentLetterGenerator");

const generateMemberId = () => {
    return "RHTM" + Math.floor(100000 + Math.random() * 900000);
};

exports.applyMembership = async (req, res) => {
    try {
        let {
            arabicName, fathersName, whatsappNumber, bloodGroup,
            faculty, degree, specialization, graduationYear, occupation, currentInstitution,
            city, postalCode, state, district, dob, address
        } = req.body;

        const userId = req.user.id;

        let existingMember = await Member.findOne({ user: userId });
        if (existingMember && existingMember.membershipStatus !== "rejected") {
            return res.status(400).json({ success: false, message: "Membership already applied." });
        }

        const memberId = existingMember ? existingMember.memberId : generateMemberId();

        // Handle profileImage upload (for ID card — can differ from login profile pic)
        let profileImage = existingMember ? existingMember.profileImage : { public_id: "", url: "" };
        const profileFile = req.files && req.files["profileImage"] ? req.files["profileImage"][0] : null;
        if (profileFile) {
            const uploadResult = await uploadLocalFile(profileFile.path);
            if (uploadResult) {
                profileImage = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        // Handle idProof upload (Aadhar / PAN / Voter ID)
        let idProof = existingMember ? existingMember.idProof : { public_id: "", url: "" };
        const idProofFile = req.files && req.files["idProof"] ? req.files["idProof"][0] : null;
        if (idProofFile) {
            const uploadResult = await uploadLocalFile(idProofFile.path);
            if (uploadResult) {
                idProof = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        // Handle alAzharCertificate upload
        let alAzharCertificate = existingMember ? existingMember.alAzharCertificate : { public_id: "", url: "" };
        const certFile = req.files && req.files["alAzharCertificate"] ? req.files["alAzharCertificate"][0] : null;
        if (certFile) {
            const uploadResult = await uploadLocalFile(certFile.path);
            if (uploadResult) {
                alAzharCertificate = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        // Update User's additional details
        if (state || district || dob || address) {
            await User.findByIdAndUpdate(userId, { 
                ...(state && { state }), 
                ...(district && { district }),
                ...(dob && { dob }),
                ...(address && { address })
            });
        }

        let member;
        if (existingMember) {
            existingMember.arabicName = arabicName || "";
            existingMember.fathersName = fathersName || "";
            existingMember.whatsappNumber = whatsappNumber || "";
            existingMember.faculty = faculty || "";
            existingMember.degree = degree || "";
            existingMember.specialization = specialization || "";
            existingMember.graduationYear = graduationYear || "";
            existingMember.occupation = occupation || "";
            existingMember.currentInstitution = currentInstitution || "";
            existingMember.city = city || "";
            existingMember.postalCode = postalCode || "";
            existingMember.profileImage = profileImage;
            existingMember.idProof = idProof;
            existingMember.alAzharCertificate = alAzharCertificate;
            existingMember.membershipStatus = "pending";
            existingMember.rejectionReason = "";
            existingMember.referredBy = null; // Removing legacy field
            await existingMember.save();
            member = existingMember;
        } else {
            member = await Member.create({
                user: userId,
                memberId,
                arabicName: arabicName || "",
                fathersName: fathersName || "",
                whatsappNumber: whatsappNumber || "",
                faculty: faculty || "",
                degree: degree || "",
                specialization: specialization || "",
                graduationYear: graduationYear || "",
                occupation: occupation || "",
                currentInstitution: currentInstitution || "",
                city: city || "",
                postalCode: postalCode || "",
                profileImage,
                idProof,
                alAzharCertificate,
                membershipStatus: "pending",
                referredBy: null
            });
        }

        res.status(201).json({ success: true, message: "Membership application submitted successfully.", member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getAllMembers = async (req, res) => {
    try {
        const members = await Member.find()
            .populate("user", "fullName email mobile role profileImage dob address state district")
            .populate("referredBy", "fullName email profileImage")
            .sort("-createdAt");
        res.status(200).json({ success: true, count: members.length, members });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.approveMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).populate("user", "fullName email dob address state district");
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        member.membershipStatus = "approved";

        // Generate QR Code containing member verification link
        const verificationLink = `${process.env.FRONTEND_URL || "https://real-human-trust-nu.vercel.app"}/verify-member/${member.memberId}`;
        const qrCodeData = await QRCode.toDataURL(verificationLink);

        member.qrCode = qrCodeData;

        await member.save();

        // Auto-generate Appointment Letter
        try {
            await generateAndSaveAppointmentLetter({
                memberId: member._id,
                designation: req.body.designation || "Member",
                department: req.body.department || "General",
                joiningDate: Date.now(),
                protocol: req.protocol,
                host: req.get("host")
            });
        } catch (letterErr) {
            console.error("Failed to generate appointment letter:", letterErr);
        }

        // Send Email Notification
        if (member.user && member.user.email) {
            const userEmail = member.user.email;
            const userName = member.user.fullName;
            const siteName = await getSiteName();
            try {
                SendVerificationCode(
                    userEmail,
                    `<p>Dear ${userName},</p><p>Congratulations! Your membership application has been approved.</p><p>Your unique Member ID is: <strong>${member.memberId}</strong></p><p>You can now log in to the Member Dashboard to access your profile, ID card, and exclusive features.</p><p>Welcome to the team!</p><p>Best Regards,<br/>${siteName} Team</p>`,
                    `Membership Approved - ${siteName}`,
                    `Dear ${userName},\n\nCongratulations! Your membership application has been approved.\nYour unique Member ID is: ${member.memberId}\n\nYou can now log in to the Member Dashboard to access your profile, ID card, and exclusive features.\n\nWelcome to the team!\n\nBest Regards,\n${siteName} Team`
                );
            } catch (emailError) {
                console.error("Error sending approval email:", emailError);
            }
        }

        res.status(200).json({ success: true, message: "Member approved and QR Code generated", member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.rejectMember = async (req, res) => {
    try {
        const { reason } = req.body;
        const member = await Member.findById(req.params.id).populate("user", "fullName email dob address state district");
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        member.membershipStatus = "rejected";
        member.rejectionReason = reason || "No reason provided by administration.";
        await member.save();

        // Send Email Notification
        if (member.user && member.user.email) {
            const userEmail = member.user.email;
            const userName = member.user.fullName;
            const siteName = await getSiteName();
            try {
                SendVerificationCode(
                    userEmail,
                    `<p>Dear ${userName},</p><p>We regret to inform you that your membership application has been rejected at this time.</p><p><strong>Reason provided by administration:</strong><br/>${reason || "No reason provided by administration."}</p><p>If you have any questions, please contact our support team.</p><p>Best Regards,<br/>${siteName} Team</p>`,
                    `Membership Application Status - ${siteName}`,
                    `Dear ${userName},\n\nWe regret to inform you that your membership application has been rejected at this time.\n\nReason provided by administration:\n${reason || "No reason provided by administration."}\n\nIf you have any questions, please contact our support team.\n\nBest Regards,\n${siteName} Team`
                );
            } catch (emailError) {
                console.error("Error sending rejection email:", emailError);
            }
        }

        res.status(200).json({ success: true, message: "Member application rejected", member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyProfile = async (req, res) => {
    try {
        const member = await Member.findOne({ user: req.user.id }).populate("user", "fullName email mobile dob address state district profileImage");
        if (!member) return res.status(404).json({ success: false, message: "Member profile not found" });

        res.status(200).json({ success: true, member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateMemberProfile = async (req, res) => {
    try {
        const { 
            fullName, mobile, dob, address, state, district,
            arabicName, fathersName, whatsappNumber,
            faculty, degree, specialization, graduationYear, occupation, currentInstitution,
            city, postalCode
        } = req.body;

        const member = await Member.findOne({ user: req.user.id });
        if (!member) {
            return res.status(404).json({ success: false, message: "Member profile not found" });
        }

        const User = require("../models/User");
        const user = await User.findById(req.user.id);

        if (fullName) user.fullName = fullName;
        if (mobile) user.mobile = mobile;
        if (dob) user.dob = dob;
        if (address) user.address = address;
        if (state) user.state = state;
        if (district) user.district = district;
        await user.save();

        if (arabicName) member.arabicName = arabicName;
        if (fathersName) member.fathersName = fathersName;
        if (whatsappNumber) member.whatsappNumber = whatsappNumber;
        if (faculty) member.faculty = faculty;
        if (degree) member.degree = degree;
        if (specialization) member.specialization = specialization;
        if (graduationYear) member.graduationYear = graduationYear;
        if (occupation) member.occupation = occupation;
        if (currentInstitution) member.currentInstitution = currentInstitution;
        if (city) member.city = city;
        if (postalCode) member.postalCode = postalCode;

        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                if (member.profileImage && member.profileImage.public_id) {
                    await deleteLocalFile(member.profileImage.public_id);
                }
                member.profileImage = {
                    public_id: uploadResult.public_id,
                    url: uploadResult.url
                };
            }
        }

        await member.save();

        const updatedMember = await Member.findById(member._id).populate("user", "fullName email mobile dob address state district profileImage");

        res.status(200).json({ success: true, message: "Profile updated successfully", member: updatedMember });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createMemberDirectly = async (req, res) => {
    try {
        const { 
            fullName, email, mobile, password,
            arabicName, fathersName, whatsappNumber,
            faculty, degree, specialization, graduationYear, occupation, currentInstitution,
            city, postalCode
        } = req.body;
        const bcrypt = require("bcryptjs");

        if (!fullName || !email || !mobile) {
            return res.status(400).json({ success: false, message: "Please provide fullName, email, and mobile" });
        }

        // 1. Check if user exists
        let user = await User.findOne({ $or: [{ email }, { mobile }] });
        if (!user) {
            // Create user
            if (!password) {
                return res.status(400).json({ success: false, message: "Please provide a password for the new user account" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = await User.create({
                fullName, email, mobile, password: hashedPassword, role: "member"
            });
        }

        // 2. Check if member already exists for this user
        const existingMember = await Member.findOne({ user: user._id });
        if (existingMember) {
            return res.status(400).json({ success: false, message: "This user is already a member" });
        }

        const memberId = generateMemberId();

        // 3. Create member (auto-approved since admin is adding)
        const member = await Member.create({
            user: user._id,
            memberId,
            arabicName: arabicName || "",
            fathersName: fathersName || "",
            whatsappNumber: whatsappNumber || "",
            bloodGroup: bloodGroup || "",
            faculty: faculty || "",
            degree: degree || "",
            specialization: specialization || "",
            graduationYear: graduationYear || "",
            occupation: occupation || "",
            currentInstitution: currentInstitution || "",
            city: city || "",
            postalCode: postalCode || "",
            createdBy: req.user.id,
            membershipStatus: "approved",
        });

        // 4. Generate QR Code
        const verificationLink = `${process.env.FRONTEND_URL || "https://real-human-trust-nu.vercel.app"}/verify-member/${member.memberId}`;
        member.qrCode = await QRCode.toDataURL(verificationLink);
        await member.save();

        // Auto-generate Appointment Letter
        try {
            await generateAndSaveAppointmentLetter({
                memberId: member._id,
                designation: "Member",
                department: "General",
                joiningDate: Date.now(),
                protocol: req.protocol,
                host: req.get("host")
            });
        } catch (letterErr) {
            console.error("Failed to generate appointment letter:", letterErr);
        }

        const populatedMember = await Member.findById(member._id).populate("user", "fullName email mobile role");

        // Send Email Notification
        if (populatedMember.user && populatedMember.user.email) {
            const userEmail = populatedMember.user.email;
            const userName = populatedMember.user.fullName;
            const siteName = await getSiteName();
            const loginInfo = !password ? "" : `\nYour account has been created with this email. Password: ${password}\n`;
            const loginInfoHtml = !password ? "" : `<p>Your account has been created with this email. Password: <strong>${password}</strong></p>`;
            try {
                SendVerificationCode(
                    userEmail,
                    `<p>Dear ${userName},</p><p>Your membership has been successfully created by the administration.</p><p>Your unique Member ID is: <strong>${member.memberId}</strong></p>${loginInfoHtml}<p>You can log in to the Member Dashboard to access your profile, ID card, and exclusive features.</p><p>Welcome to the team!</p><p>Best Regards,<br/>${siteName} Team</p>`,
                    `Welcome to ${siteName} - Membership Created`,
                    `Dear ${userName},\n\nYour membership has been successfully created by the administration.\nYour unique Member ID is: ${member.memberId}\n${loginInfo}\nYou can log in to the Member Dashboard to access your profile, ID card, and exclusive features.\n\nWelcome to the team!\n\nBest Regards,\n${siteName} Team`
                );
            } catch (emailError) {
                console.error("Error sending creation email:", emailError);
            }
        }

        res.status(201).json({ success: true, message: "Member created successfully", member: populatedMember });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyPublicMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const member = await Member.findOne({ memberId: { $regex: new RegExp(`^${memberId.trim()}$`, "i") } })
            .populate("user", "fullName email mobile profileImage");

        if (!member) {
            return res.status(404).json({ success: false, message: "Member record not found" });
        }

        res.status(200).json({
            success: true,
            verified: member.membershipStatus === "approved",
            member: {
                memberId: member.memberId,
                fullName: member.user?.fullName || "N/A",
                arabicName: member.arabicName,
                profileImage: member.profileImage?.url || member.user?.profileImage?.url || "",
                faculty: member.faculty,
                degree: member.degree,
                occupation: member.occupation,
                joiningDate: member.joiningDate,
                membershipStatus: member.membershipStatus
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteMemberAdmin = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: "Member not found" });

        await Member.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Member deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateMemberAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findById(id).populate("user");
        if (!member) return res.status(404).json({ success: false, message: "Member not found" });

        const {
            fullName, email, mobile, password,
            arabicName, fathersName, whatsappNumber, bloodGroup,
            faculty, degree, specialization, graduationYear, occupation, currentInstitution,
            city, postalCode, state, district, dob, address
        } = req.body;

        const memberUpdate = {
            ...(arabicName !== undefined && { arabicName }),
            ...(fathersName !== undefined && { fathersName }),
            ...(whatsappNumber !== undefined && { whatsappNumber }),
            ...(bloodGroup !== undefined && { bloodGroup }),
            ...(faculty !== undefined && { faculty }),
            ...(degree !== undefined && { degree }),
            ...(specialization !== undefined && { specialization }),
            ...(graduationYear !== undefined && { graduationYear }),
            ...(occupation !== undefined && { occupation }),
            ...(currentInstitution !== undefined && { currentInstitution }),
            ...(city !== undefined && { city }),
            ...(postalCode !== undefined && { postalCode }),
        };

        if (Object.keys(memberUpdate).length > 0) {
            await Member.findByIdAndUpdate(id, memberUpdate);
        }

        const userUpdate = {
            ...(fullName !== undefined && { fullName }),
            ...(email !== undefined && { email }),
            ...(mobile !== undefined && { mobile }),
            ...(state !== undefined && { state }),
            ...(district !== undefined && { district }),
            ...(dob !== undefined && { dob }),
            ...(address !== undefined && { address }),
        };
        
        if (password) {
            const bcrypt = require("bcryptjs");
            userUpdate.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(userUpdate).length > 0) {
            const mongoose = require("mongoose");
            const User = mongoose.model("User");
            await User.findByIdAndUpdate(member.user._id, userUpdate);
        }

        res.status(200).json({ success: true, message: "Member updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
