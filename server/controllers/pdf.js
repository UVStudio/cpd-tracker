const fs = require('fs');
const PDFDocument = require('pdfkit');
const Cert = require('../models/Cert');
const aws = require('aws-sdk');
const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    GET pdf
//route   GET /api/pdf/
//access  public
exports.getPDF = asyncHandler(async (req, res, next) => {
  const certs = await Cert.find();

  async function fetchImage(src) {
    const image = await axios.get(src, {
      responseType: 'arraybuffer',
    });
    return image.data;
  }

  const imgUrls = certs.map((cert) => cert.imgUrl);

  const doc = new PDFDocument();

  const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment;filename=report.pdf',
  });

  doc.on('data', (chunk) => stream.write(chunk));
  doc.on('end', () => stream.end());

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

  //res.status(200).json({ success: 'true', data: imgUrls });
});
