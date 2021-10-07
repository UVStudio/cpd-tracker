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
      const img = `data:image/png;base64,${Buffer.from(file).toString(
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

  let filesArr = [];

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(`./uploads/${userId}-${year}.pdf`)); // write to PDF
  //doc.pipe(res); //HTTP res

  doc
    .image('./assets/accounting-icon.png', {
      fit: [50, 50],
    })
    .moveDown(1);

  doc.fontSize(18).text('CPD Tracker').moveDown(0);
  doc.fontSize(10).text('By Sheriff Consulting').moveDown(2);
  doc.fontSize(12).text(`Student Name: ${user.name}`).moveDown(1);

  conn.db
    .collection('uploads.files')
    .find({
      filename: searchTerm,
    })
    .toArray(async (err, files) => {
      for (let i = 0; i < files.length; i++) {
        doc.fontSize(10).text(`Certificate #${i + 1}`);
        let tempImgFile = await downloadFile(files[i]._id);

        doc
          .image(tempImgFile, {
            fit: [384, 256],
            align: 'center',
          })
          .moveDown(2);
      }

      doc.end();
    });

  res.status(200).json({ success: 'true', data: filesArr });
});

// files.forEach((file) => {
//   gfs.createReadStream({ _id: files[0]._id }).pipe(res);
//   console.log(file);
// });
// gfs.createReadStream({ _id: files[0]._id }).pipe(res);

// gfs.files.findOne({ _id: fileId }, function (err, file) {
//   console.log('file found: ', file);
//   //console.log('res: ', res);
//   const readStream = gfs.createReadStream(file.filename);
//   readStream.pipe(res);
// });

//res.status(200).json({ success: 'true', data: imgIDs });

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

// const printingCert = async (tempImgFile) => {
//   return doc
//     .image(tempImgFile, {
//       fit: [384, 256],
//       align: 'center',
//     })
//     .moveDown(2);
// };

// for (let i = 0; i < filesArr.length; i++) {
//   gfs.files.findOne({ _id: filesArr[i] }, async (err, file) => {
//     console.log('file found: ', file);
//     doc.fontSize(14).text(`Certificate #${i + 1}`);
//     let tempImgFile = await downloadFile(file._id);
//     await printingCert(tempImgFile);
//     doc.end();
//   });
// }

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
