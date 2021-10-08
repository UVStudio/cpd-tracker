const fs = require('fs');
const mongoose = require('mongoose');
const Report = require('../models/Report');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { buildPDF } = require('../utils/pdfBuilder');

//create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;

conn.once('open', (req, res) => {
  //Init stream
  //"mongoose": "^5.13.7",
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

function downloadFile(file_id) {
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
}

//desc    POST pdf
//route   POST /api/pdf/
//access  private
exports.getPDF = asyncHandler(async (req, res, next) => {
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

  const reportObj = await Report.create({
    user: userId,
    report: response.id,
    year,
  });

  res.status(200).json({ success: 'true', response: reportObj });
});

// const stream = res.writeHead(200, {
//   'Content-Type': 'application/pdf',
//   'Content-Disposition': 'attachment;filename=report.pdf',
// });

// buildPDF(
//   imgUrls,
//   (chunk) => stream.write(chunk),
//   () => stream.end()
// );
