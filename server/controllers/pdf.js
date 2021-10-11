const fs = require('fs');
const mongoose = require('mongoose');
const Report = require('../models/Report');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const aws = require('aws-sdk');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { buildPDF } = require('../utils/pdfBuilder');
const ObjectId = require('mongodb').ObjectId;

//create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfsCerts;
let gfsReports;

conn.once('open', (req, res) => {
  //Init stream
  //"mongoose": "^5.13.7",
  gfsCerts = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

conn.once('open', (req, res) => {
  //Init stream
  //"mongoose": "^5.13.7",
  gfsReports = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'reports',
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

//desc    POST pdf
//route   POST /api/pdf/
//access  private
exports.producePDF = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const year = req.body.year;
  const searchTerm = `${userId}-${year}.jpg`;

  const user = await User.findById(userId);

  // write report to PDF
  const CPDFileName = `${userId}-${year}-CPD-report.pdf`;
  const response = await buildPDF(
    conn,
    userId,
    year,
    user,
    searchTerm,
    CPDFileName,
    downloadFile
  );

  res.status(200).json({ success: 'true' });
});

//desc    GET pdf Object by PDF ID
//route   GET /api/pdf/:id
//access  public
exports.getPDFByPDFId = asyncHandler(async (req, res, next) => {
  //const clientId = req.params.id;
  const pdfId = req.params.id;

  conn.db
    .collection('reports.files')
    .find({
      //filename: `${clientId}-2021-CPD-report.pdf`,
      _id: ObjectId(pdfId),
    })
    .toArray(async (err, files) => {
      res.status(200).json({ success: true, data: files });
    });
});
