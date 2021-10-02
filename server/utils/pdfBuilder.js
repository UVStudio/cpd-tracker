const fs = require('fs');
const PDFDocument = require('pdfkit');
const Cert = require('../models/Cert');
const aws = require('aws-sdk');
const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');

const fetchImage = async (src) => {
  try {
    const image = await axios.get(src, {
      responseType: 'arraybuffer',
    });
    return image.data;
  } catch (err) {
    return next(new ErrorResponse('Invalid source of certificate', 401));
  }
};

const buildPDF = async (imgUrls, dataCallback, endCallback) => {
  const doc = new PDFDocument();

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

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
};

module.exports = { buildPDF };
