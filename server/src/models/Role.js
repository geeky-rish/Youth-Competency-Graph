const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
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
    description: {
        type: String,
    },
    requiredSkills: [{
        type: String, // Store skill keys
    }],
    optionalSkills: [{
        type: String, // Store skill keys
    }],
    skillWeights: {
        type: Map,
        of: Number,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Role', roleSchema);
