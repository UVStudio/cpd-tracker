const express = require('express');
const { overrideHours } = require('../controllers/user');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/override', protect, overrideHours);

module.exports = router;
