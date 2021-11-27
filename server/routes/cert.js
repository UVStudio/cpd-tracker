const express = require('express');
const {
  getCertObjById,
  getAllCertObjsByUser,
  getAllCertObjsByYear,
  updateCertObjById,
  deleteCertObjById,
} = require('../controllers/cert');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getAllCertObjsByUser);
router.get('/:year', protect, getAllCertObjsByYear);
router.put('/:id', protect, updateCertObjById);
router.delete('/:id', protect, deleteCertObjById);
router.get('/:id', getCertObjById);

module.exports = router;
