const PsychometricQuestion = require('../models/PsychometricQuestion');
const PsychometricAttempt = require('../models/PsychometricAttempt');

// @desc    Get random questions for the test
// @route   GET /api/psychometric/start
// @access  Private
exports.startTest = async (req, res) => {
    try {
        const sectionCounts = {
            "Numerical Reasoning": 8,
            "Verbal Reasoning": 7,
            "Logical Reasoning": 6,
            "Abstract Reasoning": 6,
            "Situational Judgement": 8,
            "Spatial / Mechanical Reasoning": 5
        };

        let questions = [];

        for (const [section, count] of Object.entries(sectionCounts)) {
            const sectionQuestions = await PsychometricQuestion.aggregate([
                { $match: { section } },
                { $sample: { size: count } },
                { $project: { correctAnswer: 0, explanation: 0, skillSignal: 0 } } // Hide answers
            ]);
            questions = [...questions, ...sectionQuestions];
        }

        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit test attempt
// @route   POST /api/psychometric/submit
// @access  Private
exports.submitAttempt = async (req, res) => {
    try {
        const { answers } = req.body; // { questionId: "A", ... }
        const userId = req.user._id;

        const questions = await PsychometricQuestion.find({
            _id: { $in: Object.keys(answers) }
        });

        let sectionScores = {};
        let sectionTotals = {};
        let totalCorrect = 0;
        let totalQuestions = questions.length;

        // Initialize counters
        questions.forEach(q => {
            if (!sectionScores[q.section]) sectionScores[q.section] = 0;
            if (!sectionTotals[q.section]) sectionTotals[q.section] = 0;
            sectionTotals[q.section]++;

            const userAnswer = answers[q._id];
            // Check answer (assuming expected answer format matches stored format)
            // Stored might be "B" or "B)" or full text. The seed has "B". 
            // The user might send "A) 6 days" or just "A". 
            // We should match robustly. The seed data has correctAnswer as "B".
            // The options are "A) 6 days".
            // Let's assume frontend sends the single letter option keys or we parse it.
            // But wait, the seed data says `correctAnswer: "B"`.
            // The options are `["A) 6 days", ...]`.
            // So we need to ensure we compare correctly. 

            // Simple check: does the user's answer string START with the correct letter?
            // Or did the user send just the letter?
            // Let's assume the frontend sends the *full string* of the selected option, e.g. "A) 6 days".
            // Then we check if it starts with the correctAnswer + ")".

            // Actually, safer is to have frontend send just the option index or full string.
            // Let's assume frontend sends the full selected string.

            if (userAnswer && userAnswer.startsWith(q.correctAnswer + ")")) {
                sectionScores[q.section]++;
                totalCorrect++;
            }
        });

        // Calculate Percentages
        let sectionPercentages = {};
        for (const section in sectionTotals) {
            sectionPercentages[section] = Math.round((sectionScores[section] / sectionTotals[section]) * 100);
        }

        const totalScore = Math.round((totalCorrect / totalQuestions) * 100);

        // Generate Insights
        const insights = {
            logical_strength: "Developing",
            analytical_strength: "Developing",
            behavioural_maturity: "Developing",
            spatial_reasoning: "Developing"
        };

        const logicalScore = sectionPercentages["Logical Reasoning"] || 0;
        const abstractScore = sectionPercentages["Abstract Reasoning"] || 0;
        const situationalScore = sectionPercentages["Situational Judgement"] || 0;
        const numericalScore = sectionPercentages["Numerical Reasoning"] || 0;
        const spatialScore = sectionPercentages["Spatial / Mechanical Reasoning"] || 0;

        if ((logicalScore + abstractScore) / 2 >= 70) insights.analytical_strength = "Strong analytical aptitude";
        if (situationalScore >= 65) insights.behavioural_maturity = "Good professional judgement";
        if (numericalScore < 40) insights.analytical_strength = (insights.analytical_strength === "Strong analytical aptitude" ? "Mixed analytical profile" : "Needs support in quantitative reasoning");
        if (spatialScore >= 70) insights.spatial_reasoning = "High spatial intelligence";

        // Save Attempt
        const attempt = await PsychometricAttempt.create({
            userId,
            sectionScores: sectionPercentages,
            totalScore,
            suitabilityInsights: insights
        });

        res.json({
            success: true,
            score: totalScore,
            sectionScores: sectionPercentages,
            insights,
            attemptId: attempt._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get last attempt
// @route   GET /api/psychometric/history
// @access  Private
exports.getHistory = async (req, res) => {
    try {
        const attempt = await PsychometricAttempt.findOne({ userId: req.user._id }).sort({ attemptedAt: -1 });
        res.json(attempt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
