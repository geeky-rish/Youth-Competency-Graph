const express = require('express');
const router = express.Router();
const { getSkillsGraph } = require('../controllers/graphController');
const { protect } = require('../middleware/authMiddleware');

router.get('/skills', protect, getSkillsGraph);

module.exports = router;
