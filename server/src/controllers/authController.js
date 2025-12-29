const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        // Check if user already exists
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user (Unverified by default)
        const user = await User.create({
            name,
            email: normalizedEmail,
            passwordHash: password,
        });

        if (user) {
            // Generate and Send OTP
            // We can reuse the requestOtp logic or call it directly. 
            // Ideally we separate the logic, but to keep it simple and consistent:
            try {
                // Delete old OTPs
                await OTP.deleteMany({ email: normalizedEmail });
                // Generate
                const otp = require('../utils/otpGenerator').generateOtp();
                const hashedOtp = await require('bcryptjs').hash(otp, 10);

                await OTP.create({
                    email: normalizedEmail,
                    hashedOtp,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
                });

                await require('../utils/emailTransporter').sendOtpEmail(normalizedEmail, otp);

            } catch (err) {
                console.error("Failed to send initial OTP:", err);
                // Don't fail the registration, just warn? Or maybe fail? 
                // Usually better to let them request OTP again if email failed.
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                message: "Registration successful. Please verify your email.",
                // No token sent - user must verify first
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                // Optional: Resend OTP here if needed, or just tell them to verify
                return res.status(401).json({
                    message: 'Account not verified. Please verify your email.',
                    isVerified: false
                });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                skills: user.skills,
                targetRoles: user.targetRoles,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
