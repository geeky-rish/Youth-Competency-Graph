const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testSkillUpdate() {
    try {
        console.log("1. Registration...");
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
        console.log("Current skills:", proRes.data.skills);

        console.log("3. Update Skills...");
        const updateRes = await axios.put(`${API_URL}/profile/skills`, {
            skills: ['react', 'nodejs', 'javascript']
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Update Skills success. New Skills:", updateRes.data.skills);

        console.log("4. Update Target Roles...");
        const roleRes = await axios.put(`${API_URL}/profile/targets`, {
            targetRoles: ['frontend-developer', 'fullstack-developer']
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Update Roles success. New Roles:", roleRes.data.targetRoles);

        console.log("5. Verify Profile...");
        const finalRes = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Final profile:");
        console.log("Skills:", finalRes.data.skills);
        console.log("Target Roles:", finalRes.data.targetRoles);

    } catch (error) {
        console.error("TEST FAILED");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testSkillUpdate();