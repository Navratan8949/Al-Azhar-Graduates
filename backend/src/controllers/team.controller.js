const Team = require("../models/Team");
const { uploadLocalFile, deleteLocalFile } = require("../utils/fileUpload");

// Public — Get all active team members
exports.getAllTeamMembers = async (req, res) => {
    try {
        const team = await Team.find({ status: "active" }).sort("order");
        res.status(200).json({ success: true, count: team.length, team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Create team member
exports.createTeamMember = async (req, res) => {
    try {
        let { name, designation, description, email, phone, website, socialLinks, order, translations } = req.body;
        if (typeof translations === "string") {
            try { translations = JSON.parse(translations); } catch (e) { translations = {}; }
        }

        let photo = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) photo = { public_id: uploadResult.public_id, url: uploadResult.url };
        }

        const member = await Team.create({
            name,
            designation,
            description,
            email,
            phone,
            website,
            socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
            order: order || 0,
            photo,
            translations: translations || {},
            createdBy: req.user._id,
        });

        res.status(201).json({ success: true, member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Update team member
exports.updateTeamMember = async (req, res) => {
    try {
        let member = await Team.findById(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: "Team member not found" });

        const updatedData = { ...req.body };
        if (typeof updatedData.translations === "string") {
            try { updatedData.translations = JSON.parse(updatedData.translations); } catch (e) { }
        }
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                updatedData.photo = { public_id: uploadResult.public_id, url: uploadResult.url };
                if (member.photo && member.photo.public_id) {
                    await deleteLocalFile(member.photo.public_id);
                }
            }
        }
        if (updatedData.socialLinks && typeof updatedData.socialLinks === "string") {
             updatedData.socialLinks = JSON.parse(updatedData.socialLinks);
        }

        member = await Team.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json({ success: true, member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Delete team member
exports.deleteTeamMember = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
        
        if (member.photo && member.photo.public_id) {
            await deleteLocalFile(member.photo.public_id);
        }
        await member.deleteOne();
        res.status(200).json({ success: true, message: "Team member deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
