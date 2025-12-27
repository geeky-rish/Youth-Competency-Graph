const express = require('express');
const router = express.Router();
const { startTest, submitAttempt, getHistory } = require('../controllers/psychometricController');
const { protect } = require('../middleware/authMiddleware');

router.get('/start', protect, startTest);
router.post('/submit', protect, submitAttempt);
router.get('/history', protect, getHistory);

module.exports = router;
