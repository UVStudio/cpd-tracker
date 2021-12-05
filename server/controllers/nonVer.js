const NonVer = require('../models/NonVer');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc    GET nonVer session by ID
//route   GET /api/nonver/id/:id
//access  public
exports.getNonVerObjById = asyncHandler(async (req, res, next) => {
  const nonVer = await NonVer.findById(req.params.id);
  const userId = req.user.id;

  if (userId !== nonVer.user.toString()) {
    return next(
      new ErrorResponse('User not authorized to access this resource.', 400)
    );
  }

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
  let user = await User.findById(req.user.id).populate('nonver');
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

  //push nonVer Obj ID to user's cert array
  const nonVerArr = user.nonver;
  await nonVerArr.push(nonVerObj._id);

  //inc user's hour.nonVer by hours
  const query = { _id: userId, 'hours.year': year };
  const update = {
    $inc: {
      'hours.$.nonVerifiable': +hours,
    },
  };
  await User.updateOne(query, update);
  await user.save();

  user = await User.findById(req.user.id).populate('nonver');

  //returns all non-ver sessions under the same year as the non-ver session being added
  const nonVers = user.nonver;
  const nonVersYear = nonVers.filter((nonVer) => nonVer.year === year);

  res.status(200).json({ success: true, data: nonVersYear });
});

//desc    GET All Non-Ver Session Objects by current user
//route   GET /api/nonver/
//access  private
exports.getAllNonVerObjsByUser = asyncHandler(async (req, res, next) => {
  const nonVers = await NonVer.find({ user: req.user.id });

  if (!nonVers) {
    return next(
      new ErrorResponse('This user has no Non-Verifiable Session', 400)
    );
  }

  res.status(200).json({ success: true, data: nonVers });
});

//desc    GET All Non-Ver Session Objects by current user by year
//route   GET /api/nonver/:year
//access  private
exports.getAllNonVerObjsByYear = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('nonver');
  const yearParam = req.params.year;

  const year = Number(yearParam);

  if (!user) {
    return next(new ErrorResponse('There is no user logged on', 400));
  }

  const nonVers = user.nonver;
  const nonVersYear = nonVers.filter((nonVer) => nonVer.year === year);

  res.status(200).json({ success: true, data: nonVersYear });
});

//desc    UPDATE Non-Ver Session Objects by ID
//route   UPDATE /api/nonver/:id
//access  private
exports.updateNonVerObjById = asyncHandler(async (req, res, next) => {
  const nonVerId = req.params.id;
  const userId = req.user.id;
  let nonVer = await NonVer.findById(nonVerId);

  if (!nonVer) {
    return next(
      new ErrorResponse('This Non-Verifiable Session is not found', 400)
    );
  }

  if (userId !== nonVer.user.toString()) {
    return next(
      new ErrorResponse('User not authorized to access this resource.', 400)
    );
  }

  const { sessionName } = req.body;
  nonVer = await NonVer.findOneAndUpdate(
    { _id: nonVerId },
    { sessionName },
    { new: true }
  );

  const nonVerYear = nonVer.year;

  const user = await User.findById(req.user.id).populate('nonver');

  //returns all non-ver sessions under the same year as the non-ver session being updated
  const nonVers = user.nonver;
  const nonVersYear = nonVers.filter((nonVer) => nonVer.year === nonVerYear);

  res.status(200).json({ success: true, data: nonVersYear });
});

//desc    DELETE Non-Ver Session Objects by ID and Cascade to User's Non-Ver Array
//route   DELETE /api/nonver/:id
//access  private
exports.deleteNonVerObjById = asyncHandler(async (req, res, next) => {
  const nonVerId = req.params.id;
  const userId = req.user.id;
  const nonVer = await NonVer.findById(nonVerId);

  if (!nonVer) {
    return next(
      new ErrorResponse('This Non-Verifiable Session is not found', 400)
    );
  }

  if (userId !== nonVer.user.toString()) {
    return next(
      new ErrorResponse('User not authorized to access this resource.', 400)
    );
  }

  const nonVerYear = nonVer.year;
  const nonVerHours = nonVer.hours;
  const query = { _id: userId, 'hours.year': nonVerYear };
  const update = {
    $inc: {
      'hours.$.nonVerifiable': -nonVerHours,
    },
  };

  await User.updateOne(query, update);
  await User.updateOne({ _id: userId }, { $pull: { nonver: nonVerId } });
  await NonVer.deleteOne({ _id: nonVerId });

  const user = await User.findById(userId).populate('nonver');

  //returns all non-ver sessions under the same year as the non-ver session being deleted
  const nonVers = user.nonver;
  const nonVersYear = nonVers.filter((nonVer) => nonVer.year === nonVerYear);

  res.status(200).json({ success: true, data: nonVersYear });
});
