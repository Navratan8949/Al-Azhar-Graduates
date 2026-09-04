const Gallery = require("../models/Gallery");
const { uploadLocalFile, deleteLocalFile } = require("../utils/fileUpload");

// Admin — Create gallery item
exports.createGalleryItem = async (req, res) => {
    try {
        const { title, description, type, videoUrl, category, status } = req.body;

        let image = { public_id: "", url: "" };
        // For photos: upload image file; for videos: image is used as thumbnail
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                image = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const galleryItem = await Gallery.create({
            title,
            description: description || "",
            type,               // "photo" | "video"
            image,              // thumbnail for videos too
            videoUrl: videoUrl || "",
            category: category || "",
            status: status || "active",
            createdBy: req.user.id,
        });

        res.status(201).json({ success: true, galleryItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Public — Get all gallery items (active only)
// Query params: ?type=photo|video  &category=Education  &limit=20
exports.getAllGalleryItems = async (req, res) => {
    try {
        const filter = { status: "active" };

        if (req.query.type && ["photo", "video"].includes(req.query.type)) {
            filter.type = req.query.type;
        }
        if (req.query.category) {
            filter.category = req.query.category;
        }

        const limit = parseInt(req.query.limit) || 100;

        const galleryItems = await Gallery.find(filter)
            .sort("-createdAt")
            .limit(limit);

        res.status(200).json({ success: true, count: galleryItems.length, galleryItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Public — Get single gallery item
exports.getGalleryItemById = async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) return res.status(404).json({ success: false, message: "Gallery item not found" });
        res.status(200).json({ success: true, galleryItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Update gallery item
exports.updateGalleryItem = async (req, res) => {
    try {
        const { title, description, category, status, videoUrl } = req.body;
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) return res.status(404).json({ success: false, message: "Gallery item not found" });

        if (title) galleryItem.title = title;
        if (description !== undefined) galleryItem.description = description;
        if (category !== undefined) galleryItem.category = category;
        if (status) galleryItem.status = status;
        if (videoUrl !== undefined) galleryItem.videoUrl = videoUrl;

        // If a new image/thumbnail uploaded
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                if (galleryItem.image && galleryItem.image.public_id) {
                    await deleteLocalFile(galleryItem.image.public_id);
                }
                galleryItem.image = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        await galleryItem.save();
        res.status(200).json({ success: true, galleryItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) return res.status(404).json({ success: false, message: "Gallery item not found" });
        if (galleryItem.image && galleryItem.image.public_id) {
            await deleteLocalFile(galleryItem.image.public_id);
        }
        await galleryItem.deleteOne();
        res.status(200).json({ success: true, message: "Gallery item deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
