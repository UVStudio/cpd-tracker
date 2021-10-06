const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const { fromPath } = require('pdf2pic');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 300000 } });
const { uploadImage } = require('../controllers/upload');

const router = express.Router();

const { protect } = require('../middleware/auth');

//create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Init gfs
conn.once('open', (req, res) => {
  //Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('Upload');
});

router.post('/', protect, upload.single('cert'), uploadImage);

module.exports = router;
