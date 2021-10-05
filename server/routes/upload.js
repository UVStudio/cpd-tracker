const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
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

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((res, rej) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }

        const midName = file.originalname.split('.').shift();
        const filename =
          buf.toString('hex') + '-' + midName + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          //the bucketName needs to match the collection name
          bucketName: 'Upload',
        };
        res(fileInfo);
      });
    });
  },
});
const upload = multer({ storage, limits: { fileSize: 300000 } });

router.post('/', upload.single('cert'), uploadImage);

module.exports = router;

// //@route   POST /api/upload
// //@desc    Uploads file to DB
// //@access  Private
// router.post('/', upload.single('cert'), async (req, res) => {
//   try {
//     res.json({ file: req.file });
//     console.log('req.file: ', req.file);
//     // const profile = await Profile.findById(req.profile.id);
//     // profile.avatarId = avatarId;
//     // //console.log(profile);
//     // await profile.save();
//   } catch (err) {
//     // res.render('index', { msg: err });
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
