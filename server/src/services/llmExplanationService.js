/**
 * Generate an explanation for recommended resources (Simulated LLM)
 * @param {Object} params
 * @param {string} params.skill - The skill name being targeted
 * @param {Object[]} params.resources - List of recommended resources
 * @returns {Promise<string>} - Text explanation
 */
const generateExplanation = async ({ skill, resources }) => {
    // Deterministic "LLM-like" response generation
    // Since we cannot use an external API, we construct a helpful narrative based on the metadata.

    if (!resources || resources.length === 0) {
        return `To improve your ${skill} skills, I recommend looking for foundational documentation or introductory courses.`;
    }

    const titles = resources.map(r => r.title).join('", "');
    const types = [...new Set(resources.map(r => r.type))].join(' and ');

    const intro = `To master **${skill}**, I've curated these specific resources: "${titles}".`;

    const why = `Data suggests that mixing ${types} is effective for retention. ` +
        `These resources were selected because they directly address the core concepts of ${skill} ` +
        `and align with your current learning path.`;

    const how = `Start with the ${resources[0].difficulty} level content to build confidence. ` +
        `Focus on practical application as you go through the ${resources[0].type}.`;

    return `${intro}\n\n${why}\n\n${how}`;
};

module.exports = {
    generateExplanation
};
