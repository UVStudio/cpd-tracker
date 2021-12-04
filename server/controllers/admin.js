const User = require('../models/User');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    GET User By Id
//route   GET /api/admin/
//access  admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('cert')
    .populate('nonver');

  if (!user) {
    return new ErrorResponse('This User does not exist');
  }

  res.status(200).json({ success: true, data: user });
});

//desc    GET Certs By User By Id and By Year
//route   GET /api/admin/certs/user:id/:year
//access  admin
exports.getCertsByUserIdAndYear = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const year = req.params.year;
  const user = await User.findById(userId).populate('cert');
  const certs = user.cert;

  const certsYear = certs.filter((cert) => cert.year === Number(year));

  res.status(200).json({ success: true, data: certsYear });
});

//desc    GET Certs By User By Id and By Year
//route   GET /api/admin/nonver/user:id/:year
//access  admin
exports.getNonVerByUserIdAndYear = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const year = req.params.year;
  const user = await User.findById(userId).populate('nonver');
  const nonVers = user.nonver;

  const nonVersYear = nonVers.filter((nonver) => nonver.year === Number(year));

  res.status(200).json({ success: true, data: nonVersYear });
});

//desc    DELETE User By Id
//route   DELETE /api/admin/:id
//access  admin
exports.deleteUserById = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return new ErrorResponse('This User does not exist');
  }

  const filesToDelete = await conn.db
    .collection('uploads.files')
    .find({ 'metadata.userId': userId })
    .toArray();
  const filesToDeleteIds = filesToDelete.map((file) => file._id);

  const filesResult = await conn.db
    .collection('uploads.files')
    .deleteMany({ 'metadata.userId': userId });

  const chunksResult = await conn.db
    .collection('uploads.chunks')
    .deleteMany({ files_id: { $in: filesToDeleteIds } });

  const certsToDelete = await Cert.deleteMany({ user: userId });
  const nonVersToDelete = await NonVer.deleteMany({ user: userId });

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    data: {
      filesResult,
      chunksResult,
      certsToDelete,
      nonVersToDelete,
      userDeleted: userId,
    },
  });
});
