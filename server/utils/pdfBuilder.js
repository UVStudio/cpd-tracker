const PDFDocument = require('pdfkit');
const fs = require('fs');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const ErrorResponse = require('../utils/errorResponse');

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
    bucketName: 'reports',
  });
});

const buildPDF = async (
  conn,
  userId,
  year,
  user,
  searchTerm,
  CPDFileName,
  downloadFile
) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(`./uploads/${CPDFileName}`));
  const pdfObj = doc.pipe(
    gfs.openUploadStream(`${userId}-${year}-CPD-report.pdf`)
  );

  doc
    .image('./assets/accounting-icon.png', {
      fit: [50, 50],
    })
    .moveDown(1);

  doc.fontSize(18).text('CPD Tracker').moveDown(0);
  doc.fontSize(10).text('By Sheriff Consulting').moveDown(1);
  doc.fontSize(12).text(`Student Name: ${user.name}`).moveDown(1);

  conn.db
    .collection('uploads.files')
    .find({
      filename: searchTerm,
    })
    .toArray(async (err, files) => {
      for (let i = 0; i < files.length; i++) {
        doc.fontSize(10).text(`Certificate #${i + 1}`);
        let tempCertFile = await downloadFile(files[i]._id);

        doc
          .image(tempCertFile, {
            fit: [384, 256],
            align: 'center',
          })
          .moveDown(2);

        if (i === 1 || i % 2 === 1) {
          doc.addPage();
        }
      }

      doc.end();
    });
  return pdfObj.id;
};

module.exports = { buildPDF };
