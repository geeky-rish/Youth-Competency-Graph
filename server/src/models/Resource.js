const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    skills: [{
        type: String, // Skill keys
        required: true
    }],
    targetRoles: [{
        type: String, // Role keys
        required: true
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'article', 'docs', 'course'],
        required: true
    },
    estimatedTime: {
        type: String,
        required: true
    },
    prerequisites: [{
        type: String // Skill keys
    }],
    source: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient querying by skills and roles
resourceSchema.index({ skills: 1, targetRoles: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
