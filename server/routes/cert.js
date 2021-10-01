const express = require('express');
const multer = require('multer');

const {
  postCert,
  getCertById,
  deleteCertById,
  deleteAllCerts,
} = require('../controllers/cert');

const router = express.Router();

const multerSingle = multer({
  dest: 'uploads/',
  //limits: { fieldSize: 300 * 300 },
}).single('cert');

router.get('/:id', getCertById);
router.delete('/:id', deleteCertById);
router.delete('/', deleteAllCerts);
router.post('/', multerSingle, postCert);

module.exports = router;
