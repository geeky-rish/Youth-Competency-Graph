const express = require('express');
const router = express.Router();
const { getRoleFit, getNextSkills } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/role-fit', protect, getRoleFit);
router.get('/next-skills', protect, getNextSkills);

module.exports = router;
