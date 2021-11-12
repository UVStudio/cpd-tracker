const User = require('../models/User');
const Cert = require('../models/Cert');
const NonVer = require('../models/NonVer');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { currentYear } = require('../utils/currentYear');

const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//desc    CREATE user
//route   POST /api/auth/
//access  public
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, province, cpdMonth, cpdYear, role } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse('This user already exists', 400));
  }

  if (!name || !email || !password || !province || !cpdMonth || !cpdYear) {
    return next(
      new ErrorResponse('Please complete the registration form', 400)
    );
  }

  const hours = [];
  const yearsOfCPA = currentYear - cpdYear;
  let yearsHistoricData;

  if (yearsOfCPA > 2) {
    yearsHistoricData = 2;
  } else {
    yearsHistoricData = yearsOfCPA;
  }

  for (let i = 0; i <= yearsHistoricData; i++) {
    hours.push({
      year: currentYear - i,
      verifiable: 0,
      nonVerifiable: 0,
      ethics: 0,
      overriden: false,
      historic: true,
    });
  }

  hours[0].historic = false;

  user = await User.create({
    name,
    email,
    password,
    province,
    cpdMonth,
    cpdYear,
    hours,
    role,
  });

  sendTokenResponse(user, 200, res);
});

//desc    LOGIN user
//route   POST /api/auth/login
//access  public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password'); //need to see password for login

  if (!user) {
    return next(new ErrorResponse('Invalid email', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid password', 401));
  }

  //create hours objects in case user has skipped logging on for years
  //fakeCurrentYear replaces currentYear in test
  //const fakeCurrentYear = 2022;
  const userHours = user.hours;
  const lastYearDB = userHours[0].year;
  const catchUpYears = currentYear - lastYearDB;

  for (let i = catchUpYears - 1; i > -1; i--) {
    userHours.unshift({
      year: currentYear - i,
      verifiable: 0,
      nonVerifiable: 0,
      ethics: 0,
      overriden: false,
      historic: false,
    });
  }

  await user.save();

  sendTokenResponse(user, 200, res);
});

//desc    GET current logged in user
//route   GET /api/auth/
//access  private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate('cert')
    .populate('nonver'); //populate target is small cap!

  if (!user) {
    return next(new ErrorResponse('No user is logged in at the moment', 400));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

//desc    UPDATE current logged in user
//route   PUT /api/auth/
//access  private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, province, cpdYear, cpdMonth } = req.body;

  console.log('req.body: ', req.body);

  await User.updateOne(
    { _id: req.user.id },
    {
      $set: {
        name,
        email,
        province,
        cpdYear,
        cpdMonth,
        lastModifiedAt: Date.now(),
      },
    }
  );
  const userUpdated = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: userUpdated });
});

//desc    LOGOUT user / clear cookie
//route   GET /api/auth/logout
//access  private
exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
  });

  res.status(200).json({
    success: true,
    data: 'You have logged out',
  });
});

//desc    DELETE current user
//route   DELETE api/auth/
//access  private
exports.deleteCurrentUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

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

/*** HELPER ***/
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //httpOnly: true,
  };

  // if (process.env.NODE_ENV === 'production') {
  //   options.secure = true;
  // }

  //where we save token to cookie, with options
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ token, user, options });
};
