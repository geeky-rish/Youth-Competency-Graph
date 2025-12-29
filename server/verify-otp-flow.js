const axios = require('axios');
const mongoose = require('mongoose');
const OTP = require('./src/models/OTP');
const User = require('./src/models/User');
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;
const TEST_EMAIL = process.env.MAIL_USER || 'learn.rishipk@gmail.com';
const TEST_PASSWORD = 'password123';
const TEST_NAME = 'OTP Test User';

async function runTest() {
    console.log('--- Starting OTP Auth Verification ---');

    try {
        // Connect to DB to fetch OTP
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Cleanup previous test data
        await OTP.deleteMany({ email: TEST_EMAIL });
        await User.deleteMany({ email: TEST_EMAIL });
        console.log('Cleaned up previous test data');

        // 1. Send OTP
        console.log(`\n1. Requesting OTP for ${TEST_EMAIL}...`);
        try {
            const sendRes = await axios.post(`${BASE_URL}/api/otp/send-otp`, {
                email: TEST_EMAIL
            });
            console.log('Send OTP Response:', sendRes.data);
        } catch (error) {
            console.error('Failed to send OTP:', error.response ? error.response.data : error.message);
            // Verify if it failed due to SMTP?
            if (error.response && error.response.status === 500) {
                console.log("Note: This might be due to invalid SMTP credentials, but we will check if OTP was created in DB anyway (if logic permits).");
            }
        }

        // 2. Retrieve OTP from DB
        console.log('\n2. Fetching OTP from Database...');
        // Wait a moment for DB propagation
        await new Promise(resolve => setTimeout(resolve, 1000));

        const otpDoc = await OTP.findOne({ email: TEST_EMAIL }).sort({ createdAt: -1 });

        if (!otpDoc) {
            console.error('FETAL: OTP document not found in DB! Email sending might have failed completely or pre-save hook aborted creation.');
            process.exit(1);
        }

        console.log('OTP Found in DB:', otpDoc.otp);

        // 3. Register User with OTP
        console.log('\n3. Registering User with valid OTP...');
        try {
            const regRes = await axios.post(`${BASE_URL}/api/auth/register`, {
                name: TEST_NAME,
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
                otp: otpDoc.otp
            });
            console.log('Registration Success:', regRes.data);
        } catch (error) {
            console.error('Registration Failed:', error.response ? error.response.data : error.message);
            process.exit(1);
        }

        // 4. Verify Invalid OTP
        console.log('\n4. Testing Invalid OTP...');
        try {
            await axios.post(`${BASE_URL}/api/auth/register`, {
                name: TEST_NAME + " Fake",
                email: "fake" + TEST_EMAIL,
                password: TEST_PASSWORD,
                otp: "000000"
            });
            console.error('FAILED: Registration should have failed with invalid OTP');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('Success: Registration failed as expected with invalid OTP');
            } else {
                console.error('Unexpected error for invalid OTP:', error.message);
            }
        }

        console.log('\n--- Verification Completed Successfully ---');

    } catch (error) {
        console.error('Unexpected Test Error:', error);
    } finally {
        // Cleanup
        await OTP.deleteMany({ email: TEST_EMAIL });
        await User.deleteMany({ email: TEST_EMAIL });
        await mongoose.connection.close();
    }
}

runTest();
