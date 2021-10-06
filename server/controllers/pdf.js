const fs = require('fs');
const mongoose = require('mongoose');
const Cert = require('../models/Cert');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const Grid = require('gridfs-stream');
const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { buildPDF, fetchImage } = require('../utils/pdfBuilder');
const ObjectID = require('mongodb').ObjectID;

//create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;

conn.once('open', (req, res) => {
  //Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  //gfs.collection();
});

//desc    GET pdf
//route   GET /api/pdf/
//access  private
exports.getPDF = asyncHandler(async (req, res, next) => {
  const certs = await Cert.find({ user: req.user.id });
  const imgIDs = certs.map((cert) => cert.img);

  gfs.files.find().toArray(function (err, files) {
    console.log('files found: ', files);
    console.log('file type: ', typeof files[0]);
    // files.forEach((file) => {
    //   //gfs.createReadStream(file.filename).pipe(res);
    //   console.log(file);
    // });
    // const readStream = gfs.createReadStream(files[0].filename);
    // readStream.pipe(res);

    gfs.files.findOne({ _id: files[0]._id }, function (err, file) {
      console.log('file found: ', file);
    });
  });

  res.status(200).json({ success: 'true', data: imgIDs });

  // const doc = new PDFDocument();

  // doc.pipe(fs.createWriteStream('./uploads/report.pdf')); // write to PDF
  // //doc.pipe(res); //HTTP res

  // doc
  //   .image('./assets/accounting-icon.png', {
  //     fit: [50, 50],
  //   })
  //   .moveDown(1);

  // doc.fontSize(18).text('CPD Tracker').moveDown(0);
  // doc.fontSize(10).text('By Sheriff Consulting').moveDown(2);

  // for (let i = 0; i < imgUrls.length; i++) {
  //   doc.fontSize(14).text(`Certificate #${i + 1}`);

  //   let tempUrl = await fetchImage(`${imgUrls[i]}`);

  //   doc
  //     .image(tempUrl, {
  //       fit: [384, 256],
  //       align: 'center',
  //     })
  //     .moveDown(2);
  // }

  // doc.end();
});

//desc    GET pdf
//route   GET /api/pdf/
//access  private
// exports.getPDF = asyncHandler(async (req, res, next) => {
//   console.log('route hit');
//   const certs = await Cert.find();

//   const imgUrls = certs.map((cert) => cert.imgUrl);

//   const doc = new PDFDocument();

//   doc.pipe(fs.createWriteStream('./uploads/report.pdf')); // write to PDF
//   //doc.pipe(res); //HTTP res

//   doc
//     .image('./assets/accounting-icon.png', {
//       fit: [50, 50],
//     })
//     .moveDown(1);

//   doc.fontSize(18).text('CPD Tracker').moveDown(0);
//   doc.fontSize(10).text('By Sheriff Consulting').moveDown(2);

//   for (let i = 0; i < imgUrls.length; i++) {
//     doc.fontSize(14).text(`Certificate #${i + 1}`);

//     let tempUrl = await fetchImage(`${imgUrls[i]}`);

//     doc
//       .image(tempUrl, {
//         fit: [384, 256],
//         align: 'center',
//       })
//       .moveDown(2);
//   }

//   doc.end();
// });

//Browser stream method

// const stream = res.writeHead(200, {
//   'Content-Type': 'application/pdf',
//   'Content-Disposition': 'attachment;filename=report.pdf',
// });

// buildPDF(
//   imgUrls,
//   (chunk) => stream.write(chunk),
//   () => stream.end()
// );
