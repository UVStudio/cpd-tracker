const express = require('express');

const { getPDF } = require('../controllers/pdf');

const router = express.Router();

router.get('/', getPDF);

module.exports = router;
