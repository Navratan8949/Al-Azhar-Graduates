const Testimonial = require("../models/Testimonial");
const { uploadLocalFile, deleteLocalFile } = require("../utils/fileUpload");

exports.createTestimonial = async (req, res) => {
    try {
        const { name, designation, message, rating, status } = req.body;

        let image = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                image = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const testimonial = await Testimonial.create({
            name,
            designation,
            message,
            rating,
            status,
            image
        });

        res.status(201).json({ success: true, message: "Testimonial added successfully", testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllTestimonials = async (req, res) => {
    console.log("hii")
    try {
        // Can optionally filter by active status for public facing
        const query = req.query.public ? { status: "active" } : {};
        const testimonials = await Testimonial.find(query).sort("-createdAt");
        res.status(200).json({ success: true, count: testimonials.length, testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateTestimonial = async (req, res) => {
    try {
        let testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });

        const updatedData = { ...req.body };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                updatedData.image = { public_id: uploadResult.public_id, url: uploadResult.url };
                if (testimonial.image && testimonial.image.public_id) {
                    await deleteLocalFile(testimonial.image.public_id);
                }
            }
        }

        testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: "Testimonial updated", testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });

        if (testimonial.image && testimonial.image.public_id) {
            await deleteLocalFile(testimonial.image.public_id);
        }
        await testimonial.deleteOne();
        res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
