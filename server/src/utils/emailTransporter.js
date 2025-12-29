const nodemailer = require('nodemailer');

const createTransporter = () => {
    const config = {
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        secure: parseInt(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    };

    return nodemailer.createTransport(config);
};

const sendOtpEmail = async (email, otp) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: 'Your OTP Verification Code',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verification Code</h2>
        <p>Your OTP verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #666;">This code will expire in 5 minutes.</p>
        <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
        text: `Your OTP verification code is: ${otp}. This code will expire in 5 minutes.`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send OTP email');
    }
};

module.exports = {
    sendOtpEmail
};
