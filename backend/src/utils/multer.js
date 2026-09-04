const fs = require("fs");
const multer = require("multer");

const uploadDir = "temp/";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
            "-" +
            uniqueSuffix +
            "." +
            file.originalname.split(".").pop(),
        );
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Allow images, favicons, and PDFs (for ID proofs, documents)
        if (
            !file.originalname.match(
                /\.(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|webp|WEBP|pdf|PDF|ico|ICO)$/,
            )
        ) {
            req.fileValidationError = "Only image, PDF, or ICO files are allowed!";
            return cb(new Error("Only image, PDF, or ICO files are allowed!"), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

module.exports = upload;
