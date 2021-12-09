const mongoose = require('mongoose');
const User = require('../models/User');
const aws = require('aws-sdk');
const asyncHandler = require('../middleware/async');
const { buildPDF } = require('../utils/pdfBuilder');

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

// conn.once('open', (req, res) => {
//   //Init stream
//   //"mongoose": "^5.13.7",
//   gfsReports = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: 'reports',
//   });
// });

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

//desc    POST pdf
//route   POST /api/pdf/
//access  private
exports.producePDF = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const year = req.body.year;
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

//desc    DELETE pdf
//route   DELETE /api/pdf/
//access  private
exports.deletePDF = asyncHandler(async (req, res, next) => {
  const pdf = req.body.pdf;

  const pdfUrl = 'reports/' + pdf;

  const deleteParam = {
    Bucket: process.env.BUCKET_NAME,
    Key: pdfUrl,
  };

  const s3 = new aws.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    Bucket: process.env.BUCKET_NAME,
    region: process.env.REGION,
  });

  await s3
    .deleteObject(deleteParam, (err, data) => {
      if (err) console.error('err: ', err);
      if (data) console.log('delete success');
    })
    .promise();

  res.status(200).json({ success: true, data: 'Report deleted.' });
});
