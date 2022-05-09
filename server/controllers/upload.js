const fs = require('fs');
const User = require('../models/User');
const Cert = require('../models/Cert');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { certUploadHelper } = require('../utils/certUpload');

const aws = require('aws-sdk');

const s3 = new aws.S3({
  // accessKeyId: process.env.ACCESSKEYID,
  // secretAccessKey: process.env.SECRETACCESSKEY,
  Bucket: process.env.BUCKET_NAME,
  region: process.env.REGION,
});

//@route   POST /api/upload
//@desc    Uploads Cert to S3
//@access  Private
exports.uploadCert = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const userId = req.user.id;
  const bucket = req.user.bucket;
  let user = await User.findById(userId);
  const { year, hours, ethicsHours, courseName } = req.body;

  if (!year || !hours || !ethicsHours || !courseName || !file) {
    return next(
      new ErrorResponse('Please make sure all fields are filled out', 400)
    );
  }

  const certData = await certUploadHelper(userId, year, file);
  const uploadFile = certData.uploadFile;
  const newFileName = certData.newFileName;

  //Need to make a separate object for streaming to S3
  const streamS3 = fs.createReadStream(
    uploadFile.path ? uploadFile.path : `./uploads/${newFileName}.jpg`
  );

  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${bucket}${newFileName}.jpg`,
    Body: streamS3,
  };

  //Upload file to S3
  await s3
    .upload(uploadParams, (err, data) => {
      if (err) console.error('upload err: ', err);
      if (data) console.log('upload success');
    })
    .promise();

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
    s3Img: `${bucket}${newFileName}`,
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

//@route   PUT /api/upload/:id
//@desc    PUT Update courseName and FILE and CHUNKS by Cert Obj ID, Replace existing img ObjectID
//@access  Private
exports.updateCertByObjId = asyncHandler(async (req, res, next) => {
  const newFile = req.file;
  const certId = req.params.id;
  const userId = req.user.id;
  const bucket = req.user.bucket;
  const { hours } = req.body;
  let cert = await Cert.findById(certId);
  const existingCertImgId = cert.s3Img;
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

  const certData = await certUploadHelper(userId, certYear, newFile);
  const uploadFile = certData.uploadFile;
  const newFileName = certData.newFileName;

  //Jimp object does not have path. Must pass path string directly
  const streamS3 = fs.createReadStream(
    uploadFile.path ? uploadFile.path : `./uploads/${newFileName}.jpg`
  );

  //Upload new cert to S3
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${bucket}${newFileName}.jpg`,
    Body: streamS3,
  };

  await s3
    .upload(uploadParams, (err, data) => {
      if (err) console.error('upload err: ', err);
      if (data) console.log('upload success');
    })
    .promise();

  //delete old cert from S3
  const deleteParam = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${existingCertImgId}.jpg`,
  };

  await s3
    .deleteObject(deleteParam, (err, data) => {
      if (err) console.error('err: ', err);
      if (data) console.log('delete success: ', data);
    })
    .promise();

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
    { s3Img: `${bucket}${newFileName}` },
    { new: true }
  );

  const user = await User.findById(req.user.id).populate('cert');
  const certs = user.cert;
  const certsYear = certs.filter((cert) => cert.year === certYear);

  res.status(200).json({
    success: true,
    data: certsYear,
    delete: {
      existingCertImgId,
    },
  });
});

//@route   DELETE /api/upload/:id
//@desc    DELETE S3 Object By S3 Key via Cert ID
//@access  Private
exports.deleteUploadById = asyncHandler(async (req, res, next) => {
  const certId = req.params.id;
  const cert = await Cert.findById(certId);
  const s3Key = cert.s3Img;

  const deleteParam = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${s3Key}.jpg`,
  };

  await s3
    .deleteObject(deleteParam, (err, data) => {
      if (err) console.error('err: ', err);
      if (data) console.log('delete success: ', data);
    })
    .promise();

  res.status(200).json({
    success: 'true',
  });
});

// const file = await conn.db
//     .collection('uploads.files')
//     .findOne({ _id: ObjectId(fileId) });
//   const chunks = await conn.db
//     .collection('uploads.chunks')
//     .find({ files_id: ObjectId(fileId) })
//     .toArray();

//   if (!file || chunks.length == 0) {
//     return next(new ErrorResponse('File not found', 400));
//   }

//   const fileResult = await conn.db
//     .collection('uploads.files')
//     .deleteOne({ _id: ObjectId(fileId) });

//   const chunksResult = await conn.db
//     .collection('uploads.chunks')
//     .deleteMany({ files_id: ObjectId(fileId) });

//   if (fileResult.deletedCount === 0 || chunksResult.deletedCount === 0) {
//     return next(new ErrorResponse('File did not get deleted', 400));
//   }

//delete existing FILE and CHUNKS by FILE mongo ID
// const file = await conn.db
//   .collection('uploads.files')
//   .findOne({ _id: ObjectId(existingCertImgId) });
// const chunks = await conn.db
//   .collection('uploads.chunks')
//   .find({ files_id: ObjectId(existingCertImgId) })
//   .toArray();

// if (!file || chunks.length == 0) {
//   return next(new ErrorResponse('File not found', 400));
// }

// const fileResult = await conn.db
//   .collection('uploads.files')
//   .deleteOne({ _id: ObjectId(existingCertImgId) });

// const chunksResult = await conn.db
//   .collection('uploads.chunks')
//   .deleteMany({ files_id: ObjectId(existingCertImgId) });

// if (fileResult.deletedCount === 0 || chunksResult.deletedCount === 0) {
//   return next(new ErrorResponse('File did not get deleted', 400));
// }
