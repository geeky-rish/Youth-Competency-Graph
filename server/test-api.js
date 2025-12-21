const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function test() {
    try {
        console.log("1. Registration...");
        // Use random email to avoid collision
        const email = `test${Date.now()}@example.com`;
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: email,
            password: 'password123'
        });
        console.log("Registration success:", regRes.data.email);
        const token = regRes.data.token;

        console.log("2. Get Profile...");
        const proRes = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Profile success:", proRes.data.name);

        console.log("3. Update Skills...");
        const updateRes = await axios.put(`${API_URL}/profile/skills`, {
            skills: ['react', 'nodejs']
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Update Skills success. New Skills:", updateRes.data.skills);

    } catch (error) {
        console.error("TEST FAILED");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

test();
