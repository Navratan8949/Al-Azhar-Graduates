const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "navratan0443@gmail.com",
        pass: "vddi lgvz ieby hlmk",
    },
});

exports.SendVerificationCode = async (email, html, subject, text) => {
    try {
        const response = await transporter.sendMail({
            from: '"World Association for Al-Azhar Graduates" <[EMAIL_ADDRESS]>',
            to: email,
            subject: `${subject}`,
            text: `${text}`,
            html: `${html}`,
        });

        // console.log("Verification email sent:", response);
    } catch (error) {
        console.error("Error sending  email:", error);
    }
};

exports.SendMassEmail = async (bccEmails, subject, html) => {
    try {
        const response = await transporter.sendMail({
            from: '"World Association for Al-Azhar Graduates" <navratan0443@gmail.com>',
            bcc: bccEmails, // Send to everyone as BCC
            subject: subject,
            html: html,
        });
        return response;
    } catch (error) {
        console.error("Error sending mass email:", error);
        throw error;
    }
};