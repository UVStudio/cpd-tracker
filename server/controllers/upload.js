const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Cert = require('../models/Cert');
const { fromPath } = require('pdf2pic');
const Jimp = require('jimp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const ObjectId = require('mongodb').ObjectId;
const { certUploadHelper } = require('../utils/certUpload');

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

  if (!year || !hours || !ethicsHours || !courseName || !file) {
    return next(
      new ErrorResponse('Please make sure all fields are filled out', 400)
    );
  }

  const certData = await certUploadHelper(
    userId,
    year,
    courseName,
    hours,
    ethicsHours,
    file
  );
  const uploadFile = certData.uploadFile;
  const storage = certData.storage;
  const newFileName = certData.newFileName;

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

  user = await User.findById(req.user.id).populate('cert');

  const certs = user.cert;
  const certsYear = certs.filter((cert) => cert.year === Number(year));

  res.status(200).json({
    success: 'true',
    info: { file, cert: certObj, user },
    data: certsYear,
  });
});

//@route   UPDATE /api/upload/:id
//@desc    UPDATE Update courseName and FILE and CHUNKS by Cert Obj ID, Replace existing img ObjectID
//@access  Private
exports.updateCertByObjId = asyncHandler(async (req, res, next) => {
  const newFile = req.file;
  const certId = req.params.id;
  const userId = req.user.id;
  const { hours, ethicsHours, courseName } = req.body;
  let cert = await Cert.findById(certId);
  const existingCertImgId = cert.img;
  const prevHours = cert.hours;
  const certYear = cert.year;

  if (!newFile) {
    return next(new ErrorResponse('Please upload new certificate', 400));
  }

  if (userId !== cert.user.toString()) {
    return next(
      new ErrorResponse('User not authorized to access this resource.', 400)
    );
  }

  const certData = await certUploadHelper(
    userId,
    certYear,
    courseName,
    hours,
    ethicsHours,
    newFile
  );
  const uploadFile = certData.uploadFile;
  const storage = certData.storage;
  const newFileName = certData.newFileName;

  //Jimp object does not have path. Must pass path string directly
  const stream = fs.createReadStream(
    uploadFile.path ? uploadFile.path : `./uploads/${newFileName}.jpg`
  );

  //upload file to MongoDB, uploadFile is the file object to upload
  const response = await storage.fromStream(stream, req, uploadFile);

  fs.unlinkSync(newFile.path);
  fs.unlinkSync(
    uploadFile.path ? uploadFile.path : `./uploads/${newFileName}.jpg`
  );

  const hoursDiff = hours - prevHours;

  if (hoursDiff !== 0) {
    const query = { _id: userId, 'hours.year': certYear };
    const update = {
      $inc: {
        'hours.$.verifiable': hoursDiff,
      },
      $set: {
        lastModifiedAt: Date.now(),
      },
    };
    await User.updateOne(query, update);
  }

  cert = await Cert.findOneAndUpdate(
    { _id: certId },
    { img: response.id, courseName, hours, ethicsHours },
    { new: true }
  );

  //delete existing FILE and CHUNKS by FILE mongo ID
  const file = await conn.db
    .collection('uploads.files')
    .findOne({ _id: ObjectId(existingCertImgId) });
  const chunks = await conn.db
    .collection('uploads.chunks')
    .find({ files_id: ObjectId(existingCertImgId) })
    .toArray();

  if (!file || chunks.length == 0) {
    return next(new ErrorResponse('File not found', 400));
  }

  const fileResult = await conn.db
    .collection('uploads.files')
    .deleteOne({ _id: ObjectId(existingCertImgId) });

  const chunksResult = await conn.db
    .collection('uploads.chunks')
    .deleteMany({ files_id: ObjectId(existingCertImgId) });

  if (fileResult.deletedCount === 0 || chunksResult.deletedCount === 0) {
    return next(new ErrorResponse('File did not get deleted', 400));
  }

  const user = await User.findById(req.user.id).populate('cert');

  const certs = user.cert;
  const certsYear = certs.filter((cert) => cert.year === certYear);

  res.status(200).json({
    success: true,
    data: certsYear,
    delete: {
      existingCertImgId,
      file: fileResult.deletedCount,
      chunks: chunksResult.deletedCount,
    },
  });
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
