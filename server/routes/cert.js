const express = require('express');
const multer = require('multer');
const {
  //postCert,
  getCertById,
  getCertsByUser,
  deleteCertById,
  deleteAllCerts,
} = require('../controllers/cert');

const router = express.Router();

const { protect } = require('../middleware/auth');

const multerSingle = multer({
  dest: 'uploads/',
}).single('cert');

router.get('/user', protect, getCertsByUser);
router.get('/:id', getCertById);
router.delete('/:id', deleteCertById);
router.delete('/', deleteAllCerts);
//router.post('/', protect, multerSingle, postCert);

module.exports = router;
