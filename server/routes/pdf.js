const express = require('express');
const { getPDF } = require('../controllers/pdf');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getPDF);

module.exports = router;
