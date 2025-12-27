const mongoose = require('mongoose');

const psychometricQuestionSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        enum: [
            "Numerical Reasoning",
            "Verbal Reasoning",
            "Logical Reasoning",
            "Abstract Reasoning",
            "Situational Judgement",
            "Spatial / Mechanical Reasoning"
        ]
    },
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} must be of size 4']
    },
    correctAnswer: {
        type: String, // Storing the actual answer string or option letter (e.g., "A", "B", or the text)
        required: true
    },
    explanation: {
        type: String
    },
    skillSignal: {
        type: String
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length === 4;
}

module.exports = mongoose.model('PsychometricQuestion', psychometricQuestionSchema);
