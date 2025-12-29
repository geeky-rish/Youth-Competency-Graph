const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { requestOtp, verifyOtp } = require('../controllers/otpController');

// Rate limiting for OTP requests
const otpRequestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 OTP requests per windowMs
    message: { error: "Too many OTP requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting for OTP verification
const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 verification attempts per windowMs
    message: { error: "Too many verification attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/request-otp', otpRequestLimiter, requestOtp);
router.post('/verify-otp', otpVerifyLimiter, verifyOtp);

module.exports = router;
