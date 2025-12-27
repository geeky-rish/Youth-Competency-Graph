const express = require('express');
const router = express.Router();
const { getResourceRecommendations } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, getResourceRecommendations);

module.exports = router;
