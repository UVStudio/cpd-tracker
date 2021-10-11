const express = require('express');
const { producePDF, getPDFByPDFId } = require('../controllers/pdf');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, producePDF);
router.get('/:id', getPDFByPDFId);

module.exports = router;
