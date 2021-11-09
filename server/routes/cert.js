const express = require('express');
const {
  getCertObjById,
  getAllCertObjsByUser,
  getAllCertObjsByYear,
  deleteCertObjById,
} = require('../controllers/cert');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getAllCertObjsByUser);
router.get('/:year', protect, getAllCertObjsByYear);
router.delete('/:id', protect, deleteCertObjById);
router.get('/:id', getCertObjById);

module.exports = router;
