const fs = require('fs');
const NonVer = require('../models/NonVer');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ObjectId = require('mongodb').ObjectId;

//desc    GET nonVer session by ID
//route   GET /api/nonver/:id
//access  public
exports.getNonVerObjById = asyncHandler(async (req, res, next) => {
  const nonVer = await NonVer.findById(req.params.id);

  if (!nonVer) {
    return next(
      new ErrorResponse('This Non-Verifiable Session does not exist.', 400)
    );
  }

  res.status(200).json({ success: true, data: nonVer });
});

//desc    POST add Non-Verifiable Session
//route   POST /api/nonver
//access  private
exports.addNonVerEvent = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const userId = req.user.id;

  if (!user) {
    return next(new ErrorResponse('No user is logged in at the moment', 400));
  }

  const { year, date, hours, sessionName } = req.body;

  if (!year || !date || !hours || !sessionName) {
    return next(
      new ErrorResponse('Please provide all necessary information', 400)
    );
  }

  const nonVerObj = await NonVer.create({
    user: userId,
    year,
    date,
    hours,
    sessionName,
  });

  const nonVerArr = user.nonver;
  await nonVerArr.push(nonVerObj._id);

  const query = { _id: userId, 'hours.year': year };
  const update = {
    $inc: {
      'hours.$.nonVerifiable': +hours,
    },
  };
  await User.updateOne(query, update);

  await user.save();

  res.status(200).json({ success: true, data: user });
});

//desc    GET All Non-Ver Session Objects by current user
//route   GET /api/nonver/user
//access  private
exports.getAllNonVerObjsByUser = asyncHandler(async (req, res, next) => {
  const nonVers = await NonVer.find({ user: req.user.id });

  if (!nonVers) {
    return next(
      new ErrorResponse('This user has no Non-Verifiable Session', 400)
    );
  }

  console.log(nonVers);

  res.status(200).json({ success: true, data: nonVers });
});

//desc    DELETE Non-Ver Session Objects by ID and Cascade to User's Non-Ver Array
//route   DELETE /api/nonver/:id
//access  private
exports.deleteNonVerObjById = asyncHandler(async (req, res, next) => {
  const nonVerId = req.params.id;
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!nonVerId) {
    return next(
      new ErrorResponse('This Non-Verifiable Session ID is incorrect', 400)
    );
  }

  if (!user) {
    return next(new ErrorResponse('This user is not found', 400));
  }

  await NonVer.deleteOne({ _id: ObjectId(nonVerId) });

  await User.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { nonver: { _id: ObjectId(nonVerId) } } }
  );

  res.status(200).json({ success: true, data: user });
});
