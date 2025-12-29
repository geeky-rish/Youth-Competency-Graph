const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('./src/models/Skill');
const Role = require('./src/models/Role');

dotenv.config();

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const skillCount = await Skill.countDocuments();
        console.log(`Skill Count: ${skillCount}`);

        const roleCount = await Role.countDocuments();
        console.log(`Role Count: ${roleCount}`);

        if (skillCount > 0) {
            const skills = await Skill.find().limit(3);
            console.log('Sample Skills:', skills.map(s => s.name));
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDb();
