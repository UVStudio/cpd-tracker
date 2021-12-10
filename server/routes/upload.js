const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 2000000 } });
const {
  uploadCert,
  updateCertImgByObjId,
  deleteUploadById,
} = require('../controllers/upload');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('cert'), uploadCert);
router.put('/:id', protect, upload.single('cert'), updateCertImgByObjId);
router.delete('/:id', protect, deleteUploadById);

module.exports = router;
