const fs = require('fs');
const axios = require('axios');
const path = require('path');
const User = require('../models/User');
const Cert = require('../models/Cert');
const { fromPath } = require('pdf2pic');
const Jimp = require('jimp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const ObjectId = require('mongodb').ObjectId;

const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//@route   POST /api/upload
//@desc    Uploads Cert to DB
//@access  Private
exports.uploadCert = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const userId = req.user.id;
  let user = await User.findById(userId);
  const { year, hours, ethicsHours, courseName } = req.body;

  console.log('req.body: ', req.body);

  let uploadFile;

  if (!year || !hours || !ethicsHours || !courseName || !file) {
    return next(
      new ErrorResponse('Please make sure all fields are filled out', 400)
    );
  }

  //clean file name
  const cleanFileName = file.originalname.replace(/ /g, '-');
  const midName = cleanFileName.split('.').shift();
  const newFileName =
    userId +
    '-' +
    year +
    '-' +
    midName +
    '-' +
    Date.now() +
    path.extname(cleanFileName);

  //setup GFS storage function for certificate
  const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: () => {
      return {
        filename: userId + '-' + year + '.jpg',
        metadata: {
          userId,
          courseName,
          year,
        },
        bucketName: 'uploads',
      };
    },
  });

  const ext = path.extname(newFileName);

  //setup pdf2jpg options
  const options = {
    density: 100,
    quality: 60,
    saveFilename: `${newFileName}`,
    savePath: `./uploads`,
    format: 'jpg',
  };

  //if PDF, convert and compress file
  if (ext === '.pdf') {
    const storeAsImage = fromPath(file.path, options);
    const pageToConvertAsImage = 1;

    await storeAsImage(pageToConvertAsImage).then((resolve) => {
      uploadFile = resolve;
      return uploadFile;
    });
  }

  //if png, jpeg or jpg, convert to jpg and compress
  if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
    await Jimp.read(file.path)
      .then((image) => {
        image
          .resize(Jimp.AUTO, 512)
          .quality(60)
          .write(`./uploads/${newFileName}.jpg`);
        uploadFile = image;
      })
      .catch((err) => console.log(err));
  }

  //Jimp object does not have path. Must pass path string directly
  const stream = fs.createReadStream(
    uploadFile.path ? uploadFile.path : `./uploads/${newFileName}.jpg`
  );

  //upload file to MongoDB, uploadFile is the file object to upload
  const response = await storage.fromStream(stream, req, uploadFile);

  fs.unlinkSync(file.path);
  fs.unlinkSync(
    uploadFile.path ? uploadFile.path : `./uploads/${newFileName}.jpg`
  );

  //create MongoDB object with the response given from successful stream upload of cert
  const certObj = await Cert.create({
    user: userId,
    year,
    hours,
    ethicsHours,
    courseName,
    img: response.id,
  });

  //push cert Obj's ID to user's cert array
  const certArr = user.cert;
  await certArr.push(certObj._id);

  //inc user's hours.cert by hours
  const certYear = certObj.year;
  const certHours = certObj.hours;
  const certEthicsHours = certObj.ethicsHours;
  const query = { _id: userId, 'hours.year': certYear };
  const update = {
    $inc: {
      'hours.$.verifiable': certHours,
      'hours.$.ethics': certEthicsHours,
    },
  };

  await User.updateOne(query, update);

  await user.save();

  user = await User.findById(req.user.id);

  res
    .status(200)
    .json({ success: 'true', data: { file, cert: certObj, user } });
});

//@route   DELETE /api/upload/:id
//@desc    DELETE Upload FILE and CHUNKS by FILE mongo ID
//@access  Private
exports.deleteUploadById = asyncHandler(async (req, res, next) => {
  const fileId = req.params.id;

  const file = await conn.db
    .collection('uploads.files')
    .findOne({ _id: ObjectId(fileId) });
  const chunks = await conn.db
    .collection('uploads.chunks')
    .find({ files_id: ObjectId(fileId) })
    .toArray();

  if (!file || chunks.length == 0) {
    return next(new ErrorResponse('File not found', 400));
  }

  const fileResult = await conn.db
    .collection('uploads.files')
    .deleteOne({ _id: ObjectId(fileId) });

  const chunksResult = await conn.db
    .collection('uploads.chunks')
    .deleteMany({ files_id: ObjectId(fileId) });

  if (fileResult.deletedCount === 0 || chunksResult.deletedCount === 0) {
    return next(new ErrorResponse('File did not get deleted', 400));
  }

  res.status(200).json({
    success: 'true',
    data: {
      file: fileResult.deletedCount,
      chunks: chunksResult.deletedCount,
    },
  });
});
