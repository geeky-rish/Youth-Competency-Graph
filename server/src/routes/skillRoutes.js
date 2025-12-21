const express = require('express');
const router = express.Router();
const { getSkills, createSkill } = require('../controllers/skillController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSkills);
router.post('/', protect, admin, createSkill);

module.exports = router;
