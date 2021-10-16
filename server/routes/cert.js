const express = require('express');
const {
  getCertObjById,
  getAllCertObjsByUser,
  addCPDHours,
} = require('../controllers/cert');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/hours', protect, addCPDHours);
router.get('/user', protect, getAllCertObjsByUser);
router.get('/:id', getCertObjById);

module.exports = router;
