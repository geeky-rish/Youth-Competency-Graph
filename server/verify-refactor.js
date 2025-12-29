const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const TEST_EMAIL = process.env.MAIL_USER || 'learn.rishipk@gmail.com';

async function runTest() {
    console.log('--- Starting Refactored OTP Verification ---');

    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Request OTP
        console.log(`\n1. Requesting OTP for ${TEST_EMAIL}...`);
        try {
            const res = await axios.post(`${BASE_URL}/api/otp/request-otp`, {
                email: TEST_EMAIL
            });
            console.log('Request OTP Success:', res.data);
        } catch (error) {
            console.error('Request OTP Failed:', error.response ? error.response.data : error.message);
            // If internal server error, exit
            if (error.response && error.response.status === 500) process.exit(1);
        }

        // 2. We can't easily get the hashed OTP from DB to verify it automatically without hacking the DB or logs.
        // But we can check if the record exists.
        console.log('\n2. Checking DB for OTP record...');
        const Otp = require('./src/models/OTP');
        const otpRecord = await Otp.findOne({ email: TEST_EMAIL });

        if (!otpRecord) {
            console.error('FAILED: OTP record not found in DB');
            process.exit(1);
        }
        console.log('OTP Record found (Hashed):', otpRecord.hashedOtp);

        console.log('\nNOTE: Cannot automatically verify OTP without intercepting the email or unhashing (impossible).');
        console.log('Please check email for the code and manually test verification via Postman or Curl.');
        console.log('Sample Verify Command:');
        console.log(`curl -X POST ${BASE_URL}/api/otp/verify-otp -H "Content-Type: application/json" -d '{"email": "${TEST_EMAIL}", "otp": "YOUR_CODE"}'`);

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

runTest();
