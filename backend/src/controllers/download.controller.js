const Download = require("../models/Download");
const { uploadLocalFile, deleteLocalFile } = require("../utils/fileUpload");
const fs = require("fs");

// Public — Get all active downloads
exports.getAllDownloads = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = { status: "active" };
        if (category) filter.category = category;

        const downloads = await Download.find(filter).sort("-createdAt");
        res.status(200).json({ success: true, count: downloads.length, downloads });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Create download
exports.createDownload = async (req, res) => {
    try {
        const { title, description, category, fileType } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "File is required" });
        }

        const uploadResult = await uploadLocalFile(req.file.path);
        if (!uploadResult) {
            return res.status(500).json({ success: false, message: "File upload failed" });
        }

        const download = await Download.create({
            title,
            description,
            category: category || "document",
            fileType: fileType || "pdf",
            file: { public_id: uploadResult.public_id, url: uploadResult.url },
            createdBy: req.user._id,
        });

        res.status(201).json({ success: true, download });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Update download
exports.updateDownload = async (req, res) => {
    try {
        let download = await Download.findById(req.params.id);
        if (!download) return res.status(404).json({ success: false, message: "Download not found" });
        
        const updatedData = { ...req.body };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                updatedData.file = { public_id: uploadResult.public_id, url: uploadResult.url };
                if (download.file && download.file.public_id) {
                    await deleteLocalFile(download.file.public_id);
                }
            }
        }
        download = await Download.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json({ success: true, download });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Delete download
exports.deleteDownload = async (req, res) => {
    try {
        const download = await Download.findById(req.params.id);
        if (!download) return res.status(404).json({ success: false, message: "Download not found" });
        if (download.file && download.file.public_id) {
            await deleteLocalFile(download.file.public_id);
        }
        await download.deleteOne();
        res.status(200).json({ success: true, message: "Download deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
