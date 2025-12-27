const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('./src/models/Resource');

dotenv.config();

const seedResources = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Resources
        await Resource.deleteMany({});
        try {
            await Resource.collection.dropIndexes();
        } catch (e) {
            console.log("No indexes to drop");
        }
        console.log('Cleared existing Resources');

        const resources = [
            {
                title: 'MDN Web Docs - HTML',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                skills: ['html'],
                targetRoles: ['frontend_dev', 'fullstack_dev'],
                difficulty: 'beginner',
                type: 'docs',
                estimatedTime: '2 hours',
                source: 'MDN',
                description: 'The definitive guide to HTML.'
            },
            {
                title: 'CSS Tricks',
                url: 'https://css-tricks.com/',
                skills: ['css'],
                targetRoles: ['frontend_dev', 'fullstack_dev'],
                difficulty: 'intermediate',
                type: 'article',
                estimatedTime: 'Varies',
                source: 'CSS-Tricks',
                description: 'Tips, tricks, and techniques on using Cascading Style Sheets.'
            },
            {
                title: 'Modern JavaScript Tutorial',
                url: 'https://javascript.info/',
                skills: ['javascript'],
                targetRoles: ['frontend_dev', 'backend_dev', 'fullstack_dev'],
                difficulty: 'beginner',
                type: 'docs',
                estimatedTime: '10 hours',
                source: 'JavaScript.info',
                description: 'Main course contains 2 parts which cover JavaScript as a language and working with a browser.'
            },
            {
                title: 'React Official Docs',
                url: 'https://react.dev/',
                skills: ['react'],
                targetRoles: ['frontend_dev', 'fullstack_dev'],
                difficulty: 'beginner',
                type: 'docs',
                estimatedTime: '5 hours',
                source: 'React',
                description: 'Learn React from the creators.'
            },
            {
                title: 'Node.js Crash Course',
                url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
                skills: ['nodejs'],
                targetRoles: ['backend_dev', 'fullstack_dev'],
                difficulty: 'beginner',
                type: 'video',
                estimatedTime: '1.5 hours',
                source: 'YouTube',
                description: 'Crash course on Node.js.'
            },
            {
                title: 'Express Docs',
                url: 'https://expressjs.com/',
                skills: ['express'],
                targetRoles: ['backend_dev', 'fullstack_dev'],
                difficulty: 'beginner',
                type: 'docs',
                estimatedTime: '3 hours',
                source: 'Express',
                description: 'Fast, unopinionated, minimalist web framework for Node.js.'
            },
            {
                title: 'MongoDB University',
                url: 'https://university.mongodb.com/',
                skills: ['mongodb'],
                targetRoles: ['backend_dev', 'fullstack_dev'],
                difficulty: 'intermediate',
                type: 'course',
                estimatedTime: '10 hours',
                source: 'MongoDB',
                description: 'Free courses to learn MongoDB.'
            }
        ];

        await Resource.insertMany(resources);
        console.log('Resources seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedResources();
