const express = require('express');
const { producePDF, getPDFByPDFId, deletePDF } = require('../controllers/pdf');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, producePDF);
router.get('/:id', getPDFByPDFId);
router.put('/', protect, deletePDF);

module.exports = router;
