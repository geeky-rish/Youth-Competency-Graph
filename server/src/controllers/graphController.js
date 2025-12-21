const Skill = require('../models/Skill');
const { getNextBestSkills } = require('../services/recommendationService');
const Role = require('../models/Role');

// @desc    Get skills graph data
// @route   GET /api/graph/skills
// @access  Private
const getSkillsGraph = async (req, res) => {
    try {
        const user = req.user;
        const skills = await Skill.find({});
        const roles = await Role.find({}); // Needed for recommendation service

        // 1. Nodes
        const nodes = skills.map(skill => ({
            id: skill.key,
            label: skill.name,
            category: skill.category,
            data: { label: skill.name } // React Flow expects data.label
        }));

        // 2. Edges (Prerequisites)
        const edges = [];
        skills.forEach(skill => {
            if (skill.prerequisites && skill.prerequisites.length > 0) {
                skill.prerequisites.forEach(prereqKey => {
                    edges.push({
                        id: `e-${prereqKey}-${skill.key}`,
                        source: prereqKey,
                        target: skill.key,
                        type: 'smoothstep', // nice curve
                        animated: true
                    });
                });
            }
        });

        // 3. Mastered
        const mastered = user.skills;

        // 4. Recommended Next
        // We use the service we just improved
        const recommendations = getNextBestSkills(user, roles, skills);
        const recommendedNext = recommendations.map(r => r.skillKey);

        res.json({
            nodes,
            edges,
            mastered,
            recommendedNext
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSkillsGraph
};
