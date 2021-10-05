const Cert = require('../models/Cert');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const { buildPDF, fetchImage } = require('../utils/pdfBuilder');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

//desc    GET pdf
//route   GET /api/pdf/
//access  private
exports.getPDF = asyncHandler(async (req, res, next) => {
  console.log('route hit');
  const certs = await Cert.find();

  const imgUrls = certs.map((cert) => cert.imgUrl);

  const doc = new PDFDocument();

  //doc.pipe(fs.createWriteStream('./uploads/report.pdf')); // write to PDF
  doc.pipe(res); //HTTP res

  doc
    .image('./assets/accounting-icon.png', {
      fit: [50, 50],
    })
    .moveDown(1);

  doc.fontSize(18).text('CPD Tracker').moveDown(0);
  doc.fontSize(10).text('By Sheriff Consulting').moveDown(2);

  for (let i = 0; i < imgUrls.length; i++) {
    doc.fontSize(14).text(`Certificate #${i + 1}`);

    let tempUrl = await fetchImage(`${imgUrls[i]}`);

    doc
      .image(tempUrl, {
        fit: [384, 256],
        align: 'center',
      })
      .moveDown(2);
  }

  doc.end();
});

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
