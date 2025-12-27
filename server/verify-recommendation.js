const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Role = require('./src/models/Role');
const Resource = require('./src/models/Resource');
const { recommendResources } = require('./src/services/resourceRecommendationService');
const { generateExplanation } = require('./src/services/llmExplanationService');

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Get a test user (or first user)
        let user = await User.findOne();
        if (!user) {
            console.log('No user found, creating a dummy one for test if not exists');
            // Assuming we can't create without auth flow easily, but let's see.
            // If no user, we can't test fully unless we mock one.
            // We'll mock the inputs to the service instead.
            console.log('Mocking user inputs...');
        } else {
            console.log(`Testing for User: ${user.name}`);
        }

        // 2. Define Inputs
        const roleKey = 'frontend_dev';
        const missingSkills = ['react']; // Let's pretend they miss React
        const weakSkills = [];

        console.log(`\n--- Testing Recommendation Service for Role: ${roleKey} ---`);
        console.log(`Missing Skills: ${missingSkills.join(', ')}`);

        // 3. Call Service
        const resources = await recommendResources({
            missingSkills,
            weakSkills,
            role: roleKey,
            level: 'beginner'
        });

        console.log(`\nFound ${resources.length} resources:`);
        resources.forEach(r => {
            console.log(`- [${r.difficulty}] ${r.title} (${r.type}) (Score: ${r.score})`);
        });

        // 4. Call Explanation Service
        if (resources.length > 0) {
            console.log('\n--- Testing LLM Explanation ---');
            const explanation = await generateExplanation({
                skill: 'react',
                resources
            });
            console.log(explanation);
        }

        process.exit();
    } catch (error) {
        console.error('Verification Error:', error);
        process.exit(1);
    }
};

verify();
