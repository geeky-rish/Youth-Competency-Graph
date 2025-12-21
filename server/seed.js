const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('./src/models/Skill');
const Role = require('./src/models/Role');
const User = require('./src/models/User'); // Optional: Clear users? Maybe not.

dotenv.config();

const seeds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing skills and roles to avoid dups
        await Skill.deleteMany({});
        await Role.deleteMany({});

        console.log('Cleared existing Skills and Roles');

        const skills = [
            { key: 'html', name: 'HTML', category: 'Frontend', difficultyLevel: 1, description: 'Standard Markup Language' },
            { key: 'css', name: 'CSS', category: 'Frontend', difficultyLevel: 2, description: 'Style Sheet Language' },
            { key: 'javascript', name: 'JavaScript', category: 'Frontend', difficultyLevel: 3, description: 'Programming Language' },
            { key: 'react', name: 'React', category: 'Frontend', difficultyLevel: 4, description: 'JS Library for UI', prerequisites: ['javascript'] },
            { key: 'nodejs', name: 'Node.js', category: 'Backend', difficultyLevel: 3, description: 'JS Runtime' },
            { key: 'express', name: 'Express.js', category: 'Backend', difficultyLevel: 3, description: 'Web Framework for Node', prerequisites: ['nodejs'] },
            { key: 'mongodb', name: 'MongoDB', category: 'Database', difficultyLevel: 3, description: 'NoSQL Database' },
            { key: 'python', name: 'Python', category: 'Backend', difficultyLevel: 2, description: 'General purpose programming language' },
            { key: 'django', name: 'Django', category: 'Backend', difficultyLevel: 4, description: 'Python Web Framework', prerequisites: ['python'] },
            { key: 'git', name: 'Git', category: 'DevOps', difficultyLevel: 2, description: 'Version Control' },
        ];

        await Skill.insertMany(skills);
        console.log('Skills seeded');

        const roles = [
            {
                key: 'frontend_dev',
                name: 'Frontend Developer',
                description: 'Builds user interfaces',
                requiredSkills: ['html', 'css', 'javascript', 'react'],
                optionalSkills: ['git'],
                skillWeights: { 'react': 5, 'javascript': 4 }
            },
            {
                key: 'backend_dev',
                name: 'Backend Developer',
                description: 'Builds server-side logic',
                requiredSkills: ['nodejs', 'express', 'mongodb'],
                optionalSkills: ['python', 'git'],
                skillWeights: { 'nodejs': 5, 'mongodb': 4 }
            },
            {
                key: 'fullstack_dev',
                name: 'Full Stack Developer',
                description: 'Handles both frontend and backend',
                requiredSkills: ['html', 'css', 'javascript', 'react', 'nodejs', 'express', 'mongodb'],
                optionalSkills: ['git'],
                skillWeights: { 'react': 5, 'nodejs': 5 }
            }
        ];

        await Role.create(roles);
        console.log('Roles seeded');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seeds();
