const PDFDocument = require('pdfkit');
const fs = require('fs');
const mongoose = require('mongoose');
const aws = require('aws-sdk');
const { GridFsStorage } = require('multer-gridfs-storage');
const ErrorResponse = require('../utils/errorResponse');

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
  gfsReports = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'reports',
  });
});

conn.once('open', (req, res) => {
  //Init stream
  //"mongoose": "^5.13.7",
  gfsCerts = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

const buildPDF = async (
  res,
  conn,
  userId,
  year,
  user,
  searchTerm,
  CPDFileName,
  downloadFile
) => {
  const doc = new PDFDocument();

  const titleSize = 20;
  const subTitleSize = 16;
  const textSize = 12;

  const userHours = user.hours;
  const chosenYear = userHours.find((userHour) => userHour.year === year);
  const nonVerSessions = user.nonver;
  const nonVerSessionsYear = nonVerSessions.filter(
    (nonVerSession) => nonVerSession.year === year
  );

  let writeStream = fs.createWriteStream(`./uploads/${CPDFileName}`);
  doc.pipe(writeStream);

  doc
    .image('./assets/accounting-icon.png', {
      fit: [50, 50],
    })
    .moveDown(1);

  doc.fontSize(titleSize).text('CPD Tracker').moveDown(0);
  doc.fontSize(textSize).text('By Sheriff Consulting').moveDown(2);
  doc.fontSize(subTitleSize).text(`CPA Name: ${user.name}`);
  doc.fontSize(textSize).text(`CPD Report for ${year}`).moveDown(2);

  doc.fontSize(subTitleSize).text(`Summary:`).moveDown(0.5);
  doc
    .fontSize(textSize)
    .text(`Verifiable Hours: ${Number(chosenYear.verifiable).toFixed(1)}`);
  doc
    .fontSize(textSize)
    .text(
      `Non-Verifiable Hours: ${Number(chosenYear.nonVerifiable).toFixed(1)}`
    );

  doc
    .fontSize(textSize)
    .text(`Ethics Hours: ${Number(chosenYear.ethics).toFixed(1)}`)
    .moveDown(1);
  doc
    .fontSize(textSize)
    .text(
      `Total CPD Hours: ${
        Number(chosenYear.verifiable).toFixed(1) +
        Number(chosenYear.nonVerifiable).toFixed(1)
      }`
    )
    .moveDown(2);
  doc.fontSize(subTitleSize).text(`Non-Verifiable Sessions:`).moveDown(0.5);
  for (const i of nonVerSessionsYear) {
    doc
      .fontSize(textSize)
      .text(
        `Name: ${i.sessionName} - Date: ${i.date} - Duration: ${i.hours} Hour(s)`
      );
  }

  doc.addPage();

  doc.fontSize(subTitleSize).text(`Verifiable Sessions:`).moveDown(0.5);

  conn.db
    .collection('uploads.files')
    .find({
      filename: searchTerm,
    })
    .toArray(async (err, files) => {
      for (let i = 0; i < files.length; i++) {
        doc
          .fontSize(textSize)
          .text(`Course Name: ${files[i].metadata.courseName}`);
        doc.fontSize(textSize).text(`Year: ${files[i].metadata.year}`);
        let tempCertFile = await downloadFile(files[i]._id, gfsCerts);

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

  //Stream to S3 and create the URL
  let reportFileUrl;

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
  });

  const s3 = new aws.S3();

  writeStream.on('finish', () => {
    const pdfFile = fs.readFileSync(`./uploads/${CPDFileName}`);
    const params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: pdfFile,
      Key: `reports/${CPDFileName}`,
      contentType: 'application/pdf',
    };
    s3.upload(params, async (err, data) => {
      if (err) {
        res.json({ msg: err });
      }

      if (data) {
        reportFileUrl = data.Location;
        console.log(
          'Report has been uploaded to S3 and URL created successfully'
        );

        fs.unlinkSync(`./uploads/${CPDFileName}`);
        res.status(200).send({ success: true });
      }
    });
  });
};

module.exports = { buildPDF };
