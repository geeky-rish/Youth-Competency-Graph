const User = require('../models/User');

// @desc    Get user profile (already in authController but expanding if needed)
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
    // Re-using logic or expanding details
    // req.user is already fetched by protect middleware
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        skills: req.user.skills,
        targetRoles: req.user.targetRoles
    });
};

// @desc    Update user skills
// @route   PUT /api/profile/skills
// @access  Private
const updateSkills = async (req, res) => {
    console.log('updateSkills request:', req.body);
    console.log('User:', req.user ? req.user._id : 'No user');

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.skills = req.body.skills || user.skills;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                skills: updatedUser.skills,
                targetRoles: updatedUser.targetRoles
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('updateSkills error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user target roles
// @route   PUT /api/profile/targets
// @access  Private
const updateTargetRoles = async (req, res) => {
    console.log('updateTargetRoles request:', req.body);
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.targetRoles = req.body.targetRoles || user.targetRoles;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                skills: updatedUser.skills,
                targetRoles: updatedUser.targetRoles
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('updateTargetRoles error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateSkills,
    updateTargetRoles
};
