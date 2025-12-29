const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT, // 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.log("Error occurred while sending email: ", error.message);
        throw error;
    }
};

module.exports = mailSender;
