const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const TEST_EMAIL = process.env.MAIL_USER || 'learn.rishipk@gmail.com';
const TEST_PASS = 'password123';
const TEST_NAME = 'Test Refactor User';

async function runTest() {
    console.log('--- Starting Register Flow Verification ---');

    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Cleanup User
        await User.deleteOne({ email: TEST_EMAIL });

        // 1. Request OTP
        console.log(`\n1. Requesting OTP for ${TEST_EMAIL}...`);
        try {
            const res = await axios.post(`${BASE_URL}/api/otp/request-otp`, {
                email: TEST_EMAIL
            });
            console.log('Request OTP Success:', res.data);
        } catch (error) {
            console.error('Request OTP Failed:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 500) process.exit(1);
        }

        console.log('\n2. !!! MANUAL STEP REQUIRED !!!');
        console.log('Since verification requires the actual OTP from email, I cannot proceed automatically.');
        console.log('Please check the email and run the following command to verify registration:');
        console.log(`curl -X POST ${BASE_URL}/api/auth/register -H "Content-Type: application/json" -d '{"name": "${TEST_NAME}", "email": "${TEST_EMAIL}", "password": "${TEST_PASS}", "otp": "YOUR_OTP_CODE"}'`);

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

runTest();
