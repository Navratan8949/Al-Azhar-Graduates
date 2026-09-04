const News = require("../models/News");
const { uploadLocalFile, deleteLocalFile } = require("../utils/fileUpload");

exports.createNews = async (req, res) => {
    try {
        const { title, description, category, status } = req.body;
        let image = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                image = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const news = await News.create({
            title,
            description,
            category,
            status,
            image,
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort("-publishedAt");
        res.status(200).json({ success: true, count: news.length, news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ success: false, message: "News not found" });
        res.status(200).json({ success: true, news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateNews = async (req, res) => {
    try {
        let news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ success: false, message: "News not found" });

        const updatedData = { ...req.body };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                updatedData.image = { public_id: uploadResult.public_id, url: uploadResult.url };
                if (news.image && news.image.public_id) {
                    await deleteLocalFile(news.image.public_id);
                }
            }
        }

        news = await News.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        res.status(200).json({ success: true, news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ success: false, message: "News not found" });
        if (news.image && news.image.public_id) {
            await deleteLocalFile(news.image.public_id);
        }
        await news.deleteOne();
        res.status(200).json({ success: true, message: "News deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
