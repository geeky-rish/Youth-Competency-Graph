const computeRoleReadiness = (user, roles, skills) => {
    const readiness = [];
    const userSkillSet = new Set(user.skills);

    // Create skillMap for name lookup
    const skillMap = new Map(skills.map(s => [s.key, s]));

    roles.forEach(role => {
        // Intersection
        const masteredSkills = role.requiredSkills.filter(skillKey => userSkillSet.has(skillKey));

        // Difference
        const missingSkills = role.requiredSkills.filter(skillKey => !userSkillSet.has(skillKey));

        // Score Calculation: (mastered / required) * 100
        const requiredCount = role.requiredSkills.length;
        const score = requiredCount > 0 ? (masteredSkills.length / requiredCount) * 100 : 0;

        readiness.push({
            roleKey: role.key,
            roleName: role.name,
            readinessScore: Math.round(score), // Round to integer as per common UI practice
            masteredSkills: masteredSkills.map(k => ({ key: k, name: skillMap.get(k)?.name || k })),
            missingSkills: missingSkills.map(k => ({ key: k, name: skillMap.get(k)?.name || k }))
        });
    });

    return readiness;
};

const getNextBestSkills = (user, roles, skills) => {
    const userSkillSet = new Set(user.skills);
    const skillMap = new Map(skills.map(s => [s.key, s]));

    // 1. Identify Target Roles
    const targetRoles = roles.filter(r => user.targetRoles.includes(r.key));
    if (targetRoles.length === 0) return [];

    // 2. Count demand for each missing skill across target roles
    const skillDemand = new Map(); // skillKey -> count

    targetRoles.forEach(role => {
        role.requiredSkills.forEach(skillKey => {
            if (!userSkillSet.has(skillKey)) {
                skillDemand.set(skillKey, (skillDemand.get(skillKey) || 0) + 1);
            }
        });
    });

    const recommendations = [];

    // 3. Evaluate each missing skill
    skillDemand.forEach((demandCount, skillKey) => {
        const skill = skillMap.get(skillKey);
        if (!skill) return;

        // Check prerequisites
        let prereqsMet = true;
        if (skill.prerequisites && skill.prerequisites.length > 0) {
            for (const pKey of skill.prerequisites) {
                if (!userSkillSet.has(pKey)) {
                    prereqsMet = false;
                    break;
                }
            }
        }

        // Scoring Formula for Priority
        // Base priority = Demand count * 10
        // +5 if prerequisites met (ready to learn)
        // - Difficulty (easier gets higher priority to clear quick wins?) 
        // User asked to prioritize based on: number of roles, difficulty, prereqs.
        // Let's say: Priority = (Demand * 10) + (PrereqsMet ? 20 : 0) - (Difficulty * 2)

        let priority = (demandCount * 10) - (skill.difficultyLevel || 1) * 2;
        if (prereqsMet) priority += 20;

        let reason = `Required for ${demandCount} of your target roles.`;
        if (prereqsMet) reason += " Prerequisites are mastered.";
        else reason += " Prerequisites missing.";

        recommendations.push({
            skillKey: skill.key,
            skillName: skill.name,
            reason: reason,
            priority: priority,
            prereqsMet: prereqsMet
        });
    });

    // 4. Sort by priority desc
    recommendations.sort((a, b) => b.priority - a.priority);

    // Filter to return cleanest list (removing internal priority score if needed, but keeping for debug is fine)
    // User requested: { skillKey, skillName, reason }
    return recommendations.map(rec => ({
        skillKey: rec.skillKey,
        skillName: rec.skillName,
        reason: rec.reason
    }));
};

module.exports = {
    computeRoleReadiness,
    getNextBestSkills
};
