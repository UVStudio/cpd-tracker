const fs = require('fs');
const PDFDocument = require('pdfkit');
const Cert = require('../models/Cert');
const aws = require('aws-sdk');
const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { buildPDF } = require('../utils/pdfBuilder');

//desc    GET pdf
//route   GET /api/pdf/
//access  public
exports.getPDF = asyncHandler(async (req, res, next) => {
  const certs = await Cert.find();

  const imgUrls = certs.map((cert) => cert.imgUrl);

  const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment;filename=report.pdf',
  });

  buildPDF(
    imgUrls,
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
});
