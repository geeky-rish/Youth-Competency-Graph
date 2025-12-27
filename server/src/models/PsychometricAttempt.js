const mongoose = require('mongoose');

const psychometricAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sectionScores: {
        type: Map,
        of: Number, // Percentage or raw score
        required: true
    },
    totalScore: {
        type: Number,
        required: true
    },
    suitabilityInsights: {
        logical_strength: String,
        analytical_strength: String,
        behavioural_maturity: String,
        spatial_reasoning: String
    }
}, { timestamps: { createdAt: 'attemptedAt', updatedAt: false } });

module.exports = mongoose.model('PsychometricAttempt', psychometricAttemptSchema);
