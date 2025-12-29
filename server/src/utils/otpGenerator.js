const crypto = require('crypto');

const generateOtp = () => {
    // Generate a 6-digit numeric OTP
    return crypto.randomInt(100000, 1000000).toString();
};
module.exports = {
    generateOtp
};
