const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    difficultyLevel: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    description: {
        type: String,
    },
    prerequisites: [{
        type: String, // Store skill keys
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Skill', skillSchema);
