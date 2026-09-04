const AppointmentLetter = require("../models/AppointmentLetter");
const Member = require("../models/Member");
const pdf = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { getSiteName, getSiteLogoDetails } = require("./siteSettings");

const generateLetterNo = () => {
    return "RHT-AL-" + Date.now().toString().slice(-6);
};

exports.generateAndSaveAppointmentLetter = async ({ memberId, designation, department, joiningDate, protocol, host }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const member = await Member.findById(memberId).populate("user");
            if (!member) {
                return reject(new Error("Member not found"));
            }

            const letterNo = generateLetterNo();
            const siteName = await getSiteName();
            const siteLogoDetails = await getSiteLogoDetails();
            const dynamicSignatureUrl = siteLogoDetails.signature;

            // 1. Generate PDF
            const pdfFileName = `${letterNo}.pdf`;
            const localPdfPath = path.join(__dirname, "..", "..", "public", "uploads", "appointments", pdfFileName);

            // Ensure directory exists
            const dirPath = path.dirname(localPdfPath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            const doc = new pdf({ margin: 50, size: 'A4' });
            const writeStream = fs.createWriteStream(localPdfPath);
            doc.pipe(writeStream);

            const navyColor = '#002114'; // Deeper Islamic green
            const goldColor = '#b45309'; // Richer gold/amber
            const textColor = '#334155';
            const headingColor = '#0f172a';

            // Add a decorative double border
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).stroke(goldColor);
            doc.rect(24, 24, doc.page.width - 48, doc.page.height - 48).lineWidth(2).stroke(navyColor);

            // Watermark
            const logoPath = path.join(__dirname, "..", "..", "public", "images", "logo.png");
            if (fs.existsSync(logoPath)) {
                doc.save();
                doc.opacity(0.05);
                doc.image(logoPath, (doc.page.width - 300) / 2, (doc.page.height - 300) / 2, { width: 300 });
                doc.restore();
            }

            // Header Section
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, (doc.page.width - 70) / 2, 45, { width: 70 });
                doc.y = 125;
            } else {
                doc.y = 60;
            }

            const siteNameParts = siteName.split(" ");
            const firstHalf = siteNameParts.slice(0, Math.ceil(siteNameParts.length / 2)).join(" ").toUpperCase();
            const secondHalf = siteNameParts.slice(Math.ceil(siteNameParts.length / 2)).join(" ").toUpperCase();

            doc.font('Times-Bold').fontSize(22).fillColor(navyColor).text(firstHalf, { align: "center" });
            doc.font('Times-Bold').fontSize(22).fillColor(navyColor).text(secondHalf, { align: "center" });
            
            doc.moveDown(0.3);
            doc.font('Helvetica-Bold').fontSize(9).fillColor(goldColor).text("GOVT. REGD. NGO | EMPOWERING THE COMMUNITY", { align: "center", characterSpacing: 2 });
            
            doc.moveDown(1.5);
            
            // Title Line
            doc.rect(50, doc.y, doc.page.width - 100, 1).fill(goldColor);
            doc.moveDown(1);
            
            doc.font('Times-Bold').fontSize(15).fillColor(headingColor).text("APPOINTMENT LETTER", { align: "center", underline: true, characterSpacing: 1 });
            
            doc.moveDown(1.5);

            // Date and Letter No
            doc.font('Helvetica').fontSize(10).fillColor(textColor);
            const currentY = doc.y;
            doc.text(`Ref No: `, 50, currentY, { continued: true }).font('Helvetica-Bold').text(letterNo);
            doc.font('Helvetica').text(`Date: ${new Date().toLocaleDateString()}`, doc.page.width - 200, currentY, { align: 'right' });
            
            doc.moveDown(2);

            // Recipient Info
            doc.x = 50;
            doc.font('Helvetica').fontSize(10).fillColor(textColor).text(`To,`);
            doc.moveDown(0.2);
            doc.font('Helvetica-Bold').fontSize(13).fillColor(headingColor).text(`${member.user.fullName}`);
            doc.font('Helvetica').fontSize(10).fillColor(textColor).text(`Member ID: ${member.memberId}`);
            doc.text(`Email: ${member.user.email}`);
            doc.moveDown(1.5);

            // Subject
            doc.font('Helvetica-Bold').fontSize(10).fillColor(navyColor).text(`Subject: Appointment for the position of ${designation}`, { underline: false });
            doc.moveDown(1);

            // Body
            doc.font('Helvetica').fontSize(10).fillColor(textColor).text(`Dear ${member.user.fullName},`, { align: 'left' });
            doc.moveDown(0.8);
            
            doc.text(`We are pleased to appoint you as `, { continued: true })
               .font('Helvetica-Bold').text(`${designation}`, { continued: true })
               .font('Helvetica').text(` in the `, { continued: true })
               .font('Helvetica-Bold').text(`${department || "General"}`, { continued: true })
               .font('Helvetica').text(` department at `)
               .font('Helvetica-Bold').text(`${siteName}`, { continued: true })
               .font('Helvetica').text(`.`);
               
            doc.moveDown(0.6);
            doc.text(`Your effective joining date is `, { continued: true })
               .font('Helvetica-Bold').text(`${new Date(joiningDate).toLocaleDateString()}`, { continued: true })
               .font('Helvetica').text(`.`);
               
            doc.moveDown(0.8);
            doc.text("We believe your skills and experience will be an excellent match for our organization. We look forward to your positive impact on our NGO's mission and continuous dedication to community service. We expect you to uphold the values and code of conduct of the organization at all times.", { align: 'justify', lineGap: 4 });
            
            doc.moveDown(2);

            // Signature
            doc.text("Sincerely,");
            doc.moveDown(0.5);

            let signaturePath = path.join(__dirname, "..", "..", "public", "images", "signature.png");
            let hasDynamicSignature = false;

            if (dynamicSignatureUrl && dynamicSignatureUrl.includes("/public/uploads/")) {
                const sigFileName = dynamicSignatureUrl.split("/").pop();
                const dynamicPath = path.join(__dirname, "..", "..", "public", "uploads", sigFileName);
                if (fs.existsSync(dynamicPath)) {
                    signaturePath = dynamicPath;
                    hasDynamicSignature = true;
                }
            }

            if (fs.existsSync(signaturePath)) {
                doc.x = 50;
                doc.image(signaturePath, { width: 100 });
                doc.moveDown(0.5);
            } else {
                doc.moveDown(2.5);
                doc.text("_______________________");
            }

            doc.x = 50;
            doc.font('Helvetica-Bold').fontSize(10).fillColor(headingColor).text("Authorized Signatory");
            doc.font('Helvetica').fontSize(8).fillColor(goldColor).text(siteName);

            // Footer (just the line, removing the text as requested)
            doc.rect(50, doc.page.height - 60, doc.page.width - 100, 1).fill(goldColor);

            doc.end();

            // 2. Save to database when PDF is completely written
            writeStream.on("finish", async () => {
                try {
                    const pdfUrl = `${protocol}://${host}/public/uploads/appointments/${pdfFileName}`;

                    const appointmentLetter = await AppointmentLetter.create({
                        member: memberId,
                        letterNo,
                        designation,
                        department,
                        joiningDate,
                        pdf: { public_id: "", url: pdfUrl }
                    });

                    const populatedLetter = await AppointmentLetter.findById(appointmentLetter._id).populate({
                        path: "member",
                        populate: { path: "user", select: "fullName email" }
                    });

                    resolve(populatedLetter);
                } catch (saveError) {
                    reject(saveError);
                }
            });

            writeStream.on("error", (err) => {
                reject(err);
            });

        } catch (error) {
            reject(error);
        }
    });
};
