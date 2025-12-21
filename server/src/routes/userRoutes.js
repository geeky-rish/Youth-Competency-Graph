const express = require('express');
const router = express.Router();
const { getProfile, updateSkills, updateTargetRoles } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProfile);
router.put('/skills', protect, updateSkills);
router.put('/targets', protect, updateTargetRoles);

module.exports = router;
