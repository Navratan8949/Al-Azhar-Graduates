const Report = require("../models/Report");
const { uploadLocalFile, deleteLocalFile } = require("../utils/fileUpload");

exports.createReport = async (req, res) => {
    try {
        const { title, type, year, description, status } = req.body;

        let pdf = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                pdf = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const report = await Report.create({
            title,
            type,
            year,
            description,
            status,
            pdf,
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, message: "Report created successfully", report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort("-year");
        res.status(200).json({ success: true, count: reports.length, reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });
        res.status(200).json({ success: true, report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });

        if (report.pdf && report.pdf.public_id) {
            await deleteLocalFile(report.pdf.public_id);
        }
        await report.deleteOne();
        res.status(200).json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
