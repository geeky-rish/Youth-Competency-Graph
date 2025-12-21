const mongoose = require('mongoose');

const learningActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    skillKey: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['course', 'project', 'quiz', 'self-study'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed'],
        default: 'in_progress',
    },
    score: {
        type: Number,
    },
    durationHours: {
        type: Number,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('LearningActivity', learningActivitySchema);
