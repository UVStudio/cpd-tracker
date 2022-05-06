const mongoose = require('mongoose');
const User = require('../models/User');
const aws = require('aws-sdk');
const asyncHandler = require('../middleware/async');
const { buildPDF } = require('../utils/pdfBuilderS3');

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

//downloadFileS3
const downloadFileS3 = async (s3Img) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${s3Img}.jpg`,
  };

  const { Body } = await s3.getObject(params).promise();
  return `data:image/jpg;base64,${Buffer.from(Body).toString('base64')}`;
};

//desc    POST pdf
//route   POST /api/pdf/
//access  private
exports.producePDF = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const year = req.body.year;
  const searchTerm = `${userId}-${year}.jpg`;

  const user = await User.findById(userId).populate(['cert', 'nonver']);

  // write report to PDF
  const CPDFileName = `${userId}-${year}-CPD-report.pdf`;
  await buildPDF(res, conn, userId, year, user, CPDFileName, downloadFileS3);
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
