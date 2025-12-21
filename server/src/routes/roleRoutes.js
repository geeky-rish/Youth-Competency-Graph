const express = require('express');
const router = express.Router();
const { getRoles, createRole } = require('../controllers/roleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getRoles);
router.post('/', protect, admin, createRole);

module.exports = router;
