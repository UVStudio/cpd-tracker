const User = require('../models/User');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const aws = require('aws-sdk');

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  Bucket: process.env.BUCKET_NAME,
  region: process.env.REGION,
});

//create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfsCerts;
//let gfsReports;

conn.once('open', (req, res) => {
  //Init stream
  //"mongoose": "^5.13.7",
  gfsCerts = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

const downloadFile = (file_id, gfs) => {
  return new Promise((resolve, reject) => {
    const read_stream = gfs.openDownloadStream(file_id);
    let file = [];
    read_stream.on('data', (chunk) => {
      file.push(chunk);
    });
    read_stream.on('error', (e) => {
      console.log(e);
      reject(e);
    });
    return read_stream.on('end', () => {
      file = Buffer.concat(file);
      const img = `data:image/jpg;base64,${Buffer.from(file).toString(
        'base64'
      )}`;
      resolve(img);
    });
  });
};

//desc    GET User By Id
//route   GET /api/admin/
//access  admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('cert')
    .populate('nonver');

  if (!user) {
    return new ErrorResponse('This User does not exist');
  }

  res.status(200).json({ success: true, data: user });
});

//desc    GET Certs By User By Id and By Year
//route   GET /api/admin/user/certs/user:id/:year
//access  admin
exports.getCertsByUserIdAndYear = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const year = req.params.year;
  const user = await User.findById(userId).populate('cert');
  const certs = user.cert;

  const certsYear = certs.filter((cert) => cert.year === Number(year));

  res.status(200).json({ success: true, data: certsYear });
});

//desc    GET Certs By User By Id and By Year
//route   GET /api/admin/user/nonver/user:id/:year
//access  admin
exports.getNonVerByUserIdAndYear = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const year = req.params.year;
  const user = await User.findById(userId).populate('nonver');
  const nonVers = user.nonver;

  const nonVersYear = nonVers.filter((nonver) => nonver.year === Number(year));

  res.status(200).json({ success: true, data: nonVersYear });
});

//desc    DELETE User By Id
//route   DELETE /api/admin/:id
//access  admin
exports.deleteUserById = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return new ErrorResponse('This User does not exist');
  }

  const certsToDelete = await Cert.deleteMany({ user: userId });
  const nonVersToDelete = await NonVer.deleteMany({ user: userId });

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    data: {
      filesResult,
      chunksResult,
      certsToDelete,
      nonVersToDelete,
      userDeleted: userId,
    },
  });
});

//desc    GET Report by UserId and Year
//route   GET /api/admin/user/report/user:Id/:year
//access  admin
exports.getReportByUserIdYear = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const yearString = req.params.year;
  const year = Number(yearString);

  const searchTerm = `${userId}-${year}.jpg`;
  const user = await User.findById(userId).populate('nonver');

  // write report to PDF
  const CPDFileName = `${userId}-${year}-CPD-report.pdf`;
  await buildPDF(
    res,
    conn,
    userId,
    year,
    user,
    searchTerm,
    CPDFileName,
    downloadFile
  );
});

//desc    GET Users Count
//route   GET /api/admin/user/
//access  admin
exports.getUsersCount = asyncHandler(async (req, res, next) => {
  const usersCount = await User.count();

  if (!usersCount) {
    return new ErrorResponse("We don't have any users on this platform");
  }

  res.status(200).json({ success: true, data: usersCount });
});

//desc    ADD User Field by ID
//route   PUT /api/admin/user/:id
//access  admin
//note    USER MODEL MUST HAVE FIELD
exports.addUserField = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const obj = req.body;

  await User.updateOne(
    { _id: userId },
    {
      $set: obj,
    }
  );

  const user = await User.findById(userId);

  res.status(200).json({ success: true, data: user });
});

//desc    REMOVE User Field by ID
//route   PUT /api/admin/user/remove/:id
//access  admin
exports.removeUserField = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const obj = req.body;

  await User.updateOne(
    { _id: userId },
    {
      $unset: obj,
    }
  );

  const user = await User.findById(userId);

  res.status(200).json({ success: true, data: user });
});

//desc    DELETE Element from User Cert array
//route   DELETE /api/admin/user/remove/user:Id/:cert
//access  admin
exports.removeCertElementFromUserByCertId = asyncHandler(
  async (req, res, next) => {
    const userId = req.params.id;
    const certId = req.params.cert;

    await User.updateOne({ _id: userId }, { $pull: { cert: certId } });

    res.status(200).json({ success: true });
  }
);

//desc    Download individual S3 object
//route   GET /api/admin/downloadobject
//access  admin
exports.downloadObjectByKey = asyncHandler(async (req, res, next) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: 'users/Bran-6271a6fb97d12314520d7b83/6271a6fb97d12314520d7b83-2022-garth-cert-1651616668289.pdf.jpg',
  };

  const { Body } = await s3.getObject(params).promise();
  //downloads to root server folder
  // await fs.writeFile('testS3download.jpg', Body, () => {
  //   console.log('success');
  // });

  console.log('Body: ', Body);
  //console.log('Type of Body: ', typeof Body);

  //converting from Buffer to string, PDFKit only accepts string as input for .image()
  const img = `data:image/jpg;base64,${Buffer.from(Body).toString('base64')}`;
  console.log('typeof img: ', typeof img);

  res.status(200).json({ success: true });
});
