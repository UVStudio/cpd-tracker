const express = require('express');
const { overrideHours, historicUpdate } = require('../controllers/user');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/override', protect, overrideHours);
router.put('/historicupdate', protect, historicUpdate);

module.exports = router;
