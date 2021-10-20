const express = require('express');
const {
  getCertObjById,
  getAllCertObjsByUser,
  deleteCertObjById,
} = require('../controllers/cert');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/user', protect, getAllCertObjsByUser);
router.delete('/:id', protect, deleteCertObjById);
router.get('/:id', getCertObjById);

module.exports = router;
