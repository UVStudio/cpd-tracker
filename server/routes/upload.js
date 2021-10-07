const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 300000 } });
const { uploadImage } = require('../controllers/upload');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('cert'), uploadImage);

module.exports = router;
