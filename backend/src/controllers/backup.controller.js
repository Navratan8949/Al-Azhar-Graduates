const mongoose = require("mongoose");

// Admin only — Export full database stats as backup info
exports.getDatabaseBackup = async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const backupData = {};

        for (const col of collections) {
            const data = await mongoose.connection.db.collection(col.name).find({}).toArray();
            backupData[col.name] = data;
        }

        res.status(200).json({
            success: true,
            backupDate: new Date().toISOString(),
            collections: Object.keys(backupData).length,
            data: backupData,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
