const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    hashedOtp: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default: 0,
        max: 5
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure only one active OTP per email
otpSchema.index({ email: 1 }, { unique: true });

// Clean up expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
