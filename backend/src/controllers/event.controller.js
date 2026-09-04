const Event = require("../models/Event");
const { uploadLocalFile, deleteLocalFile } = require("../utils/fileUpload");

exports.createEvent = async (req, res) => {
    try {
        const { title, description, location, eventDate, registrationLastDate, maxParticipants, status } = req.body;
        let image = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                image = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const event = await Event.create({
            title,
            description,
            location,
            eventDate,
            registrationLastDate,
            maxParticipants,
            status,
            image,
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort("-eventDate");
        res.status(200).json({ success: true, count: events.length, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        const updatedData = { ...req.body };
        if (req.file) {
            const uploadResult = await uploadLocalFile(req.file.path);
            if (uploadResult) {
                updatedData.image = { public_id: uploadResult.public_id, url: uploadResult.url };
                if (event.image && event.image.public_id) {
                    await deleteLocalFile(event.image.public_id);
                }
            }
        }

        event = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        if (event.image && event.image.public_id) {
            await deleteLocalFile(event.image.public_id);
        }
        await event.deleteOne();
        res.status(200).json({ success: true, message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
