const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testApi = async () => {
    try {
        console.log('Testing GET /api/skills...');
        const res = await axios.get(`${API_URL}/skills`);
        console.log(`Status: ${res.status}`);
        console.log(`Data Length: ${res.data.length}`);
        if (res.data.length > 0) {
            console.log('Sample:', res.data[0]);
        } else {
            console.log('Data is empty array []');
        }
    } catch (error) {
        console.error('Error fetching skills:', error.message);
        if (error.response) {
            console.log('Response Status:', error.response.status);
            console.log('Response Data:', error.response.data);
        }
    }

    try {
        console.log('\nTesting GET /api/health...');
        const res = await axios.get(`${API_URL}/health`);
        console.log(`Status: ${res.status}`);
        console.log('Data:', res.data);
    } catch (error) {
        console.error('Error fetching health:', error.message);
    }
};

testApi();
