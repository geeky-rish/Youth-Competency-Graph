const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Private (or Public)
const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({});
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private/Admin
const createSkill = async (req, res) => {
    try {
        const { key, name, category, difficultyLevel, description, prerequisites } = req.body;

        const skillExists = await Skill.findOne({ key });
        if (skillExists) {
            return res.status(400).json({ message: 'Skill already exists' });
        }

        const skill = await Skill.create({
            key,
            name,
            category,
            difficultyLevel,
            description,
            prerequisites
        });

        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSkills,
    createSkill
};
