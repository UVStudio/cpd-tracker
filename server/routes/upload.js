const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 2000000 } });
const { uploadCert, deleteUploadById } = require('../controllers/upload');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('cert'), uploadCert);
router.delete('/:id', protect, deleteUploadById);

module.exports = router;
