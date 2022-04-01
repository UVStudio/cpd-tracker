const express = require('express');
const {
  getCertObjById,
  getAllCertObjsByUser,
  getAllCertObjsByYear,
  updateCertObjById,
  deleteCertObjById,
  deleteAllCertsByUserYear,
} = require('../controllers/cert');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getAllCertObjsByUser);
router.get('/id/:id', protect, getCertObjById);
router.get('/:year', protect, getAllCertObjsByYear);
router.put('/:id', protect, updateCertObjById);
router.delete('/:id', protect, deleteCertObjById);
router.delete('/year/:year', protect, deleteAllCertsByUserYear);

module.exports = router;
