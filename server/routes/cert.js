const express = require('express');
const {
  getCertById,
  getCertsByUser,
  deleteCertById,
  deleteAllCerts,
} = require('../controllers/cert');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/user', protect, getCertsByUser);
router.get('/:id', getCertById);
router.delete('/:id', deleteCertById);
router.delete('/', deleteAllCerts);

module.exports = router;
