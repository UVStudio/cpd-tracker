const fs = require('fs');
const Cert = require('../models/Cert');
const User = require('../models/User');
const aws = require('aws-sdk');
const { fromPath } = require('pdf2pic');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { deleteOne } = require('../models/Cert');

//desc    GET Cert by ID
//route   GET /api/cert/:id
//access  public
exports.getCertObjById = asyncHandler(async (req, res, next) => {
  const cert = await Cert.findById(req.params.id);

  if (!cert) {
    return next(new ErrorResponse('This certificate does not exist.', 400));
  }

  res.status(200).json({ success: true, data: cert });
});

//desc    GET Certs Objs by current user
//route   GET /api/cert/user
//access  private
exports.getAllCertObjsByUser = asyncHandler(async (req, res, next) => {
  const certs = await Cert.find({ user: req.user.id });

  if (!certs) {
    return next(new ErrorResponse('This user has no certificates.', 400));
  }

  res.status(200).json({ success: true, data: certs });
});

//desc    GET All Certs Objects by current user by year
//route   GET /api/cert/:year
//access  private
exports.getAllCertObjsByYear = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('cert');
  const yearParam = req.params.year;

  const year = Number(yearParam);

  if (!user) {
    return next(new ErrorResponse('There is no user logged on', 400));
  }

  const certs = user.cert;
  const certsYear = certs.filter((cert) => cert.year === year);

  res.status(200).json({ success: true, data: certsYear });
});

//desc    DELETE cert Obj by ID, and cascade delete user cert Array and update hours array
//route   DELETE /api/cert/:id
//access  private
exports.deleteCertObjById = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const certId = req.params.id;
  const cert = await Cert.findById(certId);

  if (!cert) {
    return next(new ErrorResponse('Certificate is not found', 400));
  }

  const certYear = cert.year;
  const certHours = cert.hours;
  const certEthicsHours = cert.ethicsHours;
  const query = { _id: userId, 'hours.year': certYear };
  const update = {
    $inc: {
      'hours.$.verifiable': -certHours,
      'hours.$.ethics': -certEthicsHours,
    },
  };

  await User.updateOne(query, update);
  await Cert.deleteOne({ _id: certId });
  await User.updateOne({ _id: userId }, { $pull: { cert: certId } });

  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});
