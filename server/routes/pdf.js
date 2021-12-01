const express = require('express');
const { producePDF, deletePDF } = require('../controllers/pdf');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, producePDF);
router.put('/', protect, deletePDF);
//router.get('/:id', getPDFByPDFId);

module.exports = router;
