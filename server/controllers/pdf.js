const Cert = require('../models/Cert');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const { buildPDF } = require('../utils/pdfBuilder');

//desc    GET pdf
//route   GET /api/pdf/
//access  private
exports.getPDF = asyncHandler(async (req, res, next) => {
  const certs = await Cert.find({ user: req.user.id });

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
