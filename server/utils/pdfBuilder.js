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

conn.once('open', (req, res) => {
  //Init stream
  //"mongoose": "^5.13.7",
  gfsCerts = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

// let gfsReports;
// conn.once('open', (req, res) => {
//   //Init stream
//   //"mongoose": "^5.13.7",
//   gfsReports = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: 'reports',
//   });
// });

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
  const avenirBold = './fonts/AvenirNextCondensed-Bold.ttf';
  const avenirDemiBold = './fonts/AvenirNextCondensed-DemiBold.ttf';
  const avenirMedium = './fonts/AvenirNextCondensed-Medium.ttf';

  const userHours = user.hours;
  const chosenYear = userHours.find((userHour) => userHour.year === year);
  const nonVerSessions = user.nonver;
  const nonVerSessionsYear = nonVerSessions.filter(
    (nonVerSession) => nonVerSession.year === year
  );
  const totalCPDHours = chosenYear.verifiable + chosenYear.nonVerifiable;

  const prevYear = userHours.find((userHour) => userHour.year === year - 1);
  const twoYearsAgo = userHours.find((userHour) => userHour.year === year - 2);

  console.log('twoYearsAgo: ', twoYearsAgo);

  const chosenYearVer = chosenYear.verifiable;
  const chosenYearNonVer = chosenYear.nonVerifiable;
  const chosenYearEthics = chosenYear.ethics;
  const chosenYearCPD = chosenYearVer + chosenYearNonVer;
  const prevYearVer = prevYear.verifiable;
  const prevYearNonVer = prevYear.nonVerifiable;
  const prevYearEthics = prevYear.ethics;
  const prevYearCPD = prevYearVer + prevYearNonVer;
  const twoYearsAgoVer = twoYearsAgo.verifiable;
  const twoYearsAgoNonVer = twoYearsAgo.nonVerifiable;
  const twoYearsAgoEthics = twoYearsAgo.ethics;
  const twoYearsAgoCPD = twoYearsAgoVer + twoYearsAgoNonVer;

  console.log('chosenYearEthics: ', chosenYearEthics);
  console.log('prevYearEthics: ', prevYearEthics);
  console.log('2YearsEthics: ', twoYearsAgoEthics);

  const totalVer = chosenYearVer + prevYearVer + twoYearsAgoVer;
  const totalNonVer = chosenYearNonVer + prevYearNonVer + twoYearsAgoNonVer;
  const totalEthics = chosenYearEthics + prevYearEthics + twoYearsAgoEthics;
  const totalCPD = totalVer + totalNonVer;

  console.log('totalVer: ', totalVer);
  console.log('totalNonVer: ', totalNonVer);
  console.log('totalEthics: ', totalEthics);
  console.log('totalCPD: ', totalCPD);

  let writeStream = fs.createWriteStream(`./uploads/${CPDFileName}`);
  doc.pipe(writeStream);

  doc
    .image('./assets/accounting-icon.png', {
      fit: [50, 50],
    })
    .moveDown(1);

  //Doc Title
  doc.fontSize(titleSize).text('CPD Tracker').moveDown(0);
  doc.fontSize(textSize).text('By Sheriff Consulting').moveDown(2);
  doc.fontSize(subTitleSize).text(`CPA Name: ${user.name}`);
  doc
    .fontSize(textSize)
    .text(`CPD Report ${twoYearsAgo.year} - ${year}`)
    .moveDown(2);

  // 3 year rolling summary bolded
  doc
    .fontSize(textSize)
    .font(avenirBold)
    .text(
      `3-Year Rolling Period ${twoYearsAgo.year} - ${year} CPD Hours Summary:`,
      {
        underline: true,
      }
    );

  doc.fontSize(textSize).font(avenirBold).text(`Verifiable Hours: ${totalVer}`);

  doc
    .fontSize(textSize)
    .font(avenirBold)
    .text(`Non-Verifiable Hours: ${totalNonVer}`);

  doc.fontSize(textSize).font(avenirBold).text(`Ethics Hours: ${totalEthics}`);

  doc
    .fontSize(textSize)
    .font(avenirBold)
    .text(`Total CPD Hours: ${totalCPD}`)
    .moveDown(2);

  //chosen year summary
  doc.fontSize(textSize).font(avenirMedium).text(`${year} CPD Hours Summary:`, {
    underline: true,
  });

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Verifiable Hours: ${chosenYearVer}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Non-Verifiable Hours: ${chosenYearNonVer}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Ethics Hours: ${chosenYearEthics}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Total CPD Hours: ${chosenYearCPD}`)
    .moveDown(2);

  //previous year summary
  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`${prevYear.year} CPD Hours Summary:`, {
      underline: true,
    });

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Verifiable Hours: ${prevYearVer}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Non-Verifiable Hours: ${prevYearNonVer}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Ethics Hours: ${prevYearEthics}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Total CPD Hours: ${prevYearCPD}`)
    .moveDown(2);

  //two years ago year summary
  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`${twoYearsAgo.year} CPD Hours Summary:`, {
      underline: true,
    });

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Verifiable Hours: ${twoYearsAgoVer}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Non-Verifiable Hours: ${twoYearsAgoNonVer}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Ethics Hours: ${twoYearsAgoEthics}`);

  doc
    .fontSize(textSize)
    .font(avenirMedium)
    .text(`Total CPD Hours: ${twoYearsAgoCPD}`)
    .moveDown(2);

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
