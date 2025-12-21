const LearningActivity = require('../models/LearningActivity');

// @desc    Get user learning activities
// @route   GET /api/learning
// @access  Private
const getActivities = async (req, res) => {
    try {
        const activities = await LearningActivity.find({ userId: req.user._id }).sort({ timestamp: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create learning activity
// @route   POST /api/learning
// @access  Private
const createActivity = async (req, res) => {
    try {
        const { skillKey, type, title, description, durationHours } = req.body;

        const activity = await LearningActivity.create({
            userId: req.user._id,
            skillKey,
            type,
            title,
            description,
            durationHours
        });

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update learning activity (e.g. complete)
// @route   PUT /api/learning/:id
// @access  Private
const updateActivity = async (req, res) => {
    try {
        const activity = await LearningActivity.findById(req.params.id);

        if (activity) {
            if (activity.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            activity.status = req.body.status || activity.status;
            activity.score = req.body.score || activity.score;

            const updatedActivity = await activity.save();
            res.json(updatedActivity);
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActivities,
    createActivity,
    updateActivity
};
