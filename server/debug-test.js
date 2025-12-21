const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testHealth() {
    try {
        console.log("Testing health endpoint...");
        const healthRes = await axios.get(`${API_URL}/health`);
        console.log("Health check success:", healthRes.data);
        return true;
    } catch (error) {
        console.error("Health check failed:", error.message);
        return false;
    }
}

async function testRegistration() {
    try {
        console.log("Testing registration...");
        const email = `test${Date.now()}@example.com`;
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: email,
            password: 'password123'
        });
        console.log("Registration success:", regRes.data);
        return regRes.data.token;
    } catch (error) {
        console.error("Registration failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
        return null;
    }
}

async function main() {
    const healthOk = await testHealth();
    if (healthOk) {
        await testRegistration();
    }
}

main();