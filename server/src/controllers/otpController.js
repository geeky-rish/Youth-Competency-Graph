const bcrypt = require("bcryptjs");
const Otp = require("../models/OTP");
const { sendOtpEmail } = require("../utils/emailTransporter");
const { generateOtp } = require("../utils/otpGenerator");
const { generateToken } = require("../utils/jwtUtils");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.requestOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: "Valid email is required" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Delete any existing OTP for this email
        await Otp.deleteOne({ email: normalizedEmail });

        // Generate new OTP
        const otp = generateOtp();
        const saltRounds = 12;
        const hashedOtp = await bcrypt.hash(otp, saltRounds);

        // Create OTP record
        const otpRecord = new Otp({
            email: normalizedEmail,
            hashedOtp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
            attempts: 0,
            isVerified: false,
        });

        await otpRecord.save();

        // Send OTP email
        try {
            await sendOtpEmail(normalizedEmail, otp);

            res.status(200).json({
                message: "OTP sent successfully",
                email: normalizedEmail,
                expiresIn: 300, // 5 minutes in seconds
            });
        } catch (emailError) {
            // Clean up OTP record if email fails
            await Otp.deleteOne({ email: normalizedEmail });

            console.error("Email sending failed:", emailError);
            res.status(500).json({ error: "Failed to send OTP email" });
        }
    } catch (error) {
        console.error("Request OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Valid email is required" });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ error: "OTP must be a 6-digit number" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log(`[DEBUG] Verify OTP for: ${email} -> ${normalizedEmail}`);

        // Find OTP record
        const otpRecord = await Otp.findOne({ email: normalizedEmail });
        console.log(`[DEBUG] OTP Record found:`, otpRecord ? 'Yes' : 'No');

        if (!otpRecord) {
            const count = await Otp.countDocuments({ email: normalizedEmail });
            console.log(`[DEBUG] OTP not found for ${normalizedEmail}. DB Count: ${count}`);
            return res.status(404).json({ error: `OTP not found for ${normalizedEmail} (Count: ${count})` });
        }

        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            await Otp.deleteOne({ email: normalizedEmail });
            return res.status(400).json({ error: "OTP has expired" });
        }

        // Check if already verified
        if (otpRecord.isVerified) {
            return res.status(400).json({ error: "OTP already used" });
        }

        // Check attempt limit
        if (otpRecord.attempts >= 5) {
            await Otp.deleteOne({ email: normalizedEmail });
            return res
                .status(429)
                .json({ error: "Maximum verification attempts exceeded" });
        }

        // Verify OTP
        const isValidOtp = await bcrypt.compare(otp, otpRecord.hashedOtp);

        if (!isValidOtp) {
            // Increment attempts
            otpRecord.attempts += 1;
            await otpRecord.save();

            const remainingAttempts = 5 - otpRecord.attempts;

            if (remainingAttempts === 0) {
                await Otp.deleteOne({ email: normalizedEmail });
                return res
                    .status(429)
                    .json({ error: "Maximum verification attempts exceeded" });
            }

            return res.status(400).json({
                error: "Invalid OTP",
                remainingAttempts,
            });
        }

        // OTP is valid - mark as verified and clean up
        await Otp.deleteOne({ email: normalizedEmail });

        // Mark user as verified
        await require('../models/User').findOneAndUpdate({ email: normalizedEmail }, { isVerified: true });

        // Generate JWT token
        const token = generateToken({
            email: normalizedEmail,
            verified: true,
            verifiedAt: new Date().toISOString(),
        });

        res.status(200).json({
            message: "OTP verified successfully",
            token,
            user: {
                email: normalizedEmail,
                verified: true,
            },
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
