const express = require('express');
const router = express.Router();
const { getActivities, createActivity, updateActivity } = require('../controllers/learningController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getActivities);
router.post('/', protect, createActivity);
router.put('/:id', protect, updateActivity);

module.exports = router;
