const User = require('../models/User');
const Skill = require('../models/Skill');
const Role = require('../models/Role');
const RecommendationLog = require('../models/RecommendationLog');
const { computeRoleReadiness, getNextBestSkills } = require('../services/recommendationService');

// @desc    Get role readiness scores
// @route   GET /api/recommendations/role-fit
// @access  Private
const getRoleFit = async (req, res) => {
    try {
        const user = req.user; // from protect middleware
        const skills = await Skill.find({});
        const roles = await Role.find({});

        const readiness = computeRoleReadiness(user, roles, skills);
        res.json(readiness);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get next best skills
// @route   GET /api/recommendations/next-skills
// @access  Private
const getNextSkills = async (req, res) => {
    try {
        const user = req.user;
        const skills = await Skill.find({});
        const roles = await Role.find({});

        const recommendations = getNextBestSkills(user, roles, skills);

        // Async log recommendations (fire and forget or await)
        // We probably don't want to log every single refres, only new ones, but for now let's just return.
        // Actually spec says: "Also logs results into RecommendationLog".
        // Let's log top 3 to avoid spam.
        const logs = recommendations.slice(0, 3).map(rec => ({
            userId: user._id,
            recommendedSkillKey: rec.skillKey,
            reason: rec.reason
        }));

        if (logs.length > 0) {
            // Use insertMany but handle potential duplicates or just log
            await RecommendationLog.insertMany(logs);
        }

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRoleFit,
    getNextSkills
};
