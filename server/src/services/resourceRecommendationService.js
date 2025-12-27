const Resource = require('../models/Resource');

/**
 * Recommend resources based on skill gaps and role
 * @param {Object} params
 * @param {string[]} params.missingSkills - List of missing skill keys
 * @param {string[]} params.weakSkills - List of weak skill keys
 * @param {string} params.role - Target role key
 * @param {string} params.level - User difficulty level (beginner, intermediate, advanced)
 * @returns {Promise<Object[]>} - Array of recommended resources
 */
const recommendResources = async ({ missingSkills, weakSkills, role, level = 'beginner' }) => {
    const targetSkills = [...new Set([...missingSkills, ...weakSkills])];

    if (targetSkills.length === 0) {
        return [];
    }

    // Find resources that match any of the target skills AND the target role
    // This is a broad match first
    const candidates = await Resource.find({
        skills: { $in: targetSkills },
        targetRoles: role
    });

    // Scoring and Ranking
    const rankedResources = candidates.map(resource => {
        let score = 0;

        // Base score for matching a skill
        const matchedSkillsCount = resource.skills.filter(s => targetSkills.includes(s)).length;
        score += matchedSkillsCount * 10;

        // Difficulty match bonus
        if (resource.difficulty === level) {
            score += 5;
        }

        // Type preference (Docs and Courses often provide more depth)
        if (resource.type === 'docs' || resource.type === 'course') {
            score += 2;
        }

        // Penalize if difficulty is way off (e.g. advanced for beginner)
        if (level === 'beginner' && resource.difficulty === 'advanced') {
            score -= 10;
        }

        return {
            ...resource.toObject(),
            score
        };
    });

    // Sort by score descending and take top 5
    rankedResources.sort((a, b) => b.score - a.score);

    return rankedResources.slice(0, 5);
};

module.exports = {
    recommendResources
};
