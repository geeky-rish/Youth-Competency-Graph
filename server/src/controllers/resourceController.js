const Resource = require('../models/Resource');
const User = require('../models/User');
const Role = require('../models/Role');
const { recommendResources } = require('../services/resourceRecommendationService');
const { generateExplanation } = require('../services/llmExplanationService');

/**
 * @desc    Get resource recommendations
 * @route   POST /api/resources/recommend
 * @access  Private
 */
const getResourceRecommendations = async (req, res, next) => {
    try {
        const userId = req.user._id; // Assumes auth middleware populates req.user
        const { role: targetRoleKey } = req.body;

        if (!targetRoleKey) {
            return res.status(400).json({ message: 'Target role is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch Role definition to know required skills
        const roleDef = await Role.findOne({ key: targetRoleKey });
        if (!roleDef) {
            return res.status(404).json({ message: 'Role not found' });
        }

        // Derive Missing Skills
        // requiredSkills are skill keys
        const userSkills = user.skills || [];
        const missingSkills = roleDef.requiredSkills.filter(
            skillKey => !userSkills.includes(skillKey)
        );

        // Derive Weak Skills (Placeholder logic: For now, assume no explicit "weak" tracking without assessment data, 
        // or treat all missing as potential "weak" areas to bolster)
        // In a real scenario, we'd query LearningActivity for low scores.
        const weakSkills = [];

        if (missingSkills.length === 0 && weakSkills.length === 0) {
            return res.status(200).json({
                message: 'You have all the required skills for this role!',
                recommendations: []
            });
        }

        // Get Recommendations
        // We'll prioritize the first few missing skills to not overwhelm the user
        const prioritizedSkills = missingSkills.slice(0, 3);

        const recommendations = [];

        for (const skill of prioritizedSkills) {
            const resources = await recommendResources({
                missingSkills: [skill],
                weakSkills: [],
                role: targetRoleKey,
                level: 'beginner' // Could derive from user profile if available
            });

            if (resources.length > 0) {
                const explanation = await generateExplanation({
                    skill,
                    resources
                });

                recommendations.push({
                    skill,
                    explanation,
                    resources: resources.map(r => ({
                        title: r.title,
                        url: r.url,
                        difficulty: r.difficulty,
                        type: r.type,
                        description: r.description
                    }))
                });
            }
        }

        res.status(200).json({
            count: recommendations.length,
            recommendations
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getResourceRecommendations
};
