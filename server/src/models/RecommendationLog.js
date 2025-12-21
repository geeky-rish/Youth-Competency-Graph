const mongoose = require('mongoose');

const recommendationLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recommendedSkillKey: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
    },
    accepted: {
        type: Boolean,
        default: false,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // This adds createdAt and updatedAt
});

module.exports = mongoose.model('RecommendationLog', recommendationLogSchema);
