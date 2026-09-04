const pdf = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReceiptPDF = (donation, donorName, donorEmail, siteName) => {
    return new Promise((resolve, reject) => {
        try {
            const receiptsDir = path.join(__dirname, "..", "..", "receipts");
            if (!fs.existsSync(receiptsDir)) {
                fs.mkdirSync(receiptsDir, { recursive: true });
            }

            const pdfPath = path.join(receiptsDir, `${donation.receiptNumber}.pdf`);
            const doc = new pdf({ margin: 50 });
            const writeStream = fs.createWriteStream(pdfPath);

            doc.pipe(writeStream);

            // Header
            doc.fontSize(22).font('Helvetica-Bold').text(siteName || "World Association for Al-Azhar Graduates", { align: "center" });
            doc.fontSize(10).font('Helvetica').text("1st Floor, DK Plaza Complex, New Naherunagar Nagar Main Road, Rajkot, Gujarat. 360002", { align: "center" });
            doc.text("Email: realhumantrust@gmail.com | Phone: +918735899909", { align: "center" });
            doc.moveDown(2);

            // Title
            doc.fontSize(16).font('Helvetica-Bold').text("DONATION RECEIPT", { align: "center", underline: true });
            doc.moveDown(2);

            // Details Left/Right
            doc.fontSize(12).font('Helvetica-Bold').text(`Receipt No: `, { continued: true }).font('Helvetica').text(`${donation.receiptNumber}`);
            doc.font('Helvetica-Bold').text(`Date: `, { continued: true }).font('Helvetica').text(`${new Date(donation.createdAt).toLocaleDateString()}`);
            doc.moveDown(1);

            // Donor Details
            doc.font('Helvetica-Bold').text("Received with thanks from:");
            doc.font('Helvetica').text(`Name: ${donorName}`);
            doc.text(`Email: ${donorEmail}`);
            if (donation.phone) doc.text(`Phone: ${donation.phone}`);
            doc.moveDown(1);

            // Amount
            doc.font('Helvetica-Bold').text(`Amount Received: `, { continued: true }).font('Helvetica').text(`INR ${donation.amount}/-`);
            if (donation.transactionId) {
                doc.font('Helvetica-Bold').text(`Transaction ID / UTR: `, { continued: true }).font('Helvetica').text(`${donation.transactionId}`);
            } else if (donation.paymentId) {
                doc.font('Helvetica-Bold').text(`Payment ID: `, { continued: true }).font('Helvetica').text(`${donation.paymentId}`);
            }
            doc.moveDown(2);

            // Tax Exemption Note
            doc.rect(50, doc.y, 500, 60).stroke();
            doc.moveDown(1);
            doc.fontSize(10).font('Helvetica-Bold').text("80G Tax Exemption Details:", { align: 'center' });
            doc.font('Helvetica').text("Donations are eligible for tax exemption under section 80G of the Income Tax Act, 1961.", { align: 'center' });
            doc.text("PAN: AAAAA0000A | 80G Registration No: RHT-80G-2023-XXXX", { align: 'center' });

            doc.moveDown(4);
            doc.fontSize(12).font('Helvetica-Bold').text("Authorized Signatory", { align: "right" });
            doc.fontSize(10).font('Helvetica').text(siteName || "World Association for Al-Azhar Graduates", { align: "right" });

            doc.end();

            writeStream.on("finish", () => {
                resolve(pdfPath);
            });

            writeStream.on("error", (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

const generateCertificatePDF = (certificate, memberName, siteName) => {
    console.log(certificate);
    console.log(memberName);
    return new Promise((resolve, reject) => {
        try {
            const certsDir = path.join(__dirname, "..", "..", "public", "certificates");
            if (!fs.existsSync(certsDir)) {
                fs.mkdirSync(certsDir, { recursive: true });
            }

            const fileName = `${certificate.certificateNo}-${Date.now()}.pdf`;
            const pdfPath = path.join(certsDir, fileName);
            // Create landscape document
            const doc = new pdf({
                layout: 'landscape',
                size: 'A4',
                margin: 50
            });

            const writeStream = fs.createWriteStream(pdfPath);
            doc.pipe(writeStream);

            // Draw Border
            doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(4).stroke('#194c8f');
            doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70).lineWidth(1).stroke('#93e018');

            // Header / Trust Info
            // Header / Trust Info
            doc.fontSize(28).font('Helvetica-Bold').fillColor('#194c8f');
            doc.moveDown(0.5);
            doc.text(siteName || "World Association for Al-Azhar Graduates", { align: "center" });
            doc.fontSize(12).font('Helvetica').fillColor('#555555').text("1st Floor, DK Plaza Complex, New Naherunagar Nagar Main Road, Rajkot, Gujarat. 360002", { align: "center" });

            // Certificate Title
            doc.fontSize(36).font('Helvetica-Bold').fillColor('#f59e0b');
            doc.moveDown(1);
            doc.text("CERTIFICATE OF APPRECIATION", { align: "center" });

            // Subtitle
            doc.fontSize(16).font('Helvetica-Oblique').fillColor('#333333');
            doc.moveDown(1);
            doc.text("This certificate is proudly presented to", { align: "center" });

            // Member Name
            doc.fontSize(32).font('Helvetica-Bold').fillColor('#194c8f');
            doc.moveDown(0.5);
            doc.text(memberName, { align: "center", underline: true });

            // Description / Title
            doc.fontSize(14).font('Helvetica').fillColor('#333333');
            doc.moveDown(1.5);
            doc.text("For outstanding contribution as:", { align: "center" });
            
            doc.fontSize(18).font('Helvetica-Bold').fillColor('#333333');
            doc.moveDown(0.5);
            doc.text(certificate.title, { align: "center" });

            if (certificate.description) {
                doc.fontSize(14).font('Helvetica').fillColor('#555555');
                doc.moveDown(1);
                doc.text(certificate.description, (doc.page.width - 600) / 2, doc.y, {
                    align: "center",
                    width: 600
                });
            }

            // Footer / Signatures
            const bottomY = doc.page.height - 150;

            // Left - Date & Cert No
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#194c8f').text(`Date:`, 80, bottomY);
            doc.font('Helvetica').fillColor('#333333').text(new Date().toLocaleDateString(), 80, bottomY + 20);

            doc.font('Helvetica-Bold').fillColor('#194c8f').text(`Certificate No:`, 80, bottomY + 50);
            doc.font('Helvetica').fillColor('#333333').text(certificate.certificateNo, 80, bottomY + 70);

            // Right - Signature placeholder
            doc.font('Helvetica-Oblique').fontSize(24).fillColor('#194c8f').text("Authorized Signatory", doc.page.width - 300, bottomY);
            doc.moveTo(doc.page.width - 300, bottomY + 40).lineTo(doc.page.width - 80, bottomY + 40).lineWidth(1).stroke('#333333');
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text("Chairman / President", doc.page.width - 300, bottomY + 50);

            doc.end();

            writeStream.on("finish", () => {
                resolve(pdfPath);
            });

            writeStream.on("error", (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateReceiptPDF, generateCertificatePDF };
