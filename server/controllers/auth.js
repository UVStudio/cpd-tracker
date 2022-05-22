const User = require('../models/User');
const Cert = require('../models/Cert');
const NonVer = require('../models/NonVer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const aws = require('aws-sdk');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { currentYear } = require('../utils/currentYear');

const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  Bucket: process.env.BUCKET_NAME,
  region: process.env.REGION,
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

  const userNameS3 = user.name.replace(' ', '-');

  const bucketParam = {
    Bucket: process.env.BUCKET_NAME,
    Key: `users/${userNameS3}-${user._id.toString()}/`,
  };

  await s3
    .putObject(bucketParam, (err, data) => {
      if (err) console.error('auth err: ', err);
      if (data) console.log('folder created successfully: ', data);
    })
    .promise();

  user.bucket = bucketParam.Key;

  await user.save();

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
  //const fakeCurrentYear = 2023;
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

//desc     update password
//route    PUT /api/auth/password
//access   Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id).select('+password');

  const { oldPassword, newPassword } = req.body;

  //Check if password matches
  const isMatch = await user.matchPassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid password', 401));
  }

  //mongoDB syntax requires bcrypting the password as Model pre save function doesn't apply
  const salt = await bcrypt.genSalt(10);
  const encrypted = await bcrypt.hash(newPassword, salt);

  await User.updateOne(
    { _id: req.user.id },
    {
      $set: {
        password: encrypted,
        lastModifiedAt: Date.now(),
      },
    }
  );

  user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

//desc    GENERATE Verification code
//route   POST /api/auth/generateVeriCode
//access  public
exports.generateVeriCode = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('This user does not exist.', 404));
  }

  let mailText;
  let mailSubject;

  //get reset token
  const veriCode = user.getVerificationCode();

  await user.save({ validateBeforeSave: false });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  if (user.active) {
    mailSubject = `CPD Tracker Password Reset`;
    mailText = `You have requested to reset your password for the CPD Tracker. Here is your 6 digit verification code: <strong>${veriCode}</strong>. If you did not request a reset, please contact developer@sheriffconsulting.com immediately.`;
  }

  mailSubject = `CPD Tracker Activation Request`;
  mailText = `Here is your 6 digit activation code for your CPD Tracker App. Here is your 6 digit activation code: <strong>${veriCode}</strong>. If you did not try to activate your account, please contact developer@sheriffconsulting.com immediately. Thank you for using our app.`;

  try {
    await sgMail.send({
      to: user.email,
      from: 'developer@sheriffconsulting.com',
      subject: `${mailSubject}`,
      html: `<p>Hello ${user.name}, <br><br>
        ${mailText}<br>
        <br>
        Thanks, <br><br>
        Leonard Shen, Application Developer<br>
        Sheriff Consulting
        <br>
        </p>`,
    });
    res.status(200).json({
      success: true,
      data: veriCode,
    });
  } catch (err) {
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(err, 500));
  }
});

//desc    POST Verification code
//route   POST /api/auth/generateVeriCode/:vericode
//access  public
exports.verificationCode = asyncHandler(async (req, res, next) => {
  const verificationCode = crypto
    .createHash('sha256')
    .update(req.params.vericode)
    .digest('hex');

  const user = await User.findOne({
    verificationCode,
    verificationCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid verification code', 400));
  }

  res.status(200).json({
    data: user,
    success: true,
  });
});

//desc    RESET password
//route   PUT /api/auth/generateVeriCode/:vericode
//access  public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const verificationCode = crypto
    .createHash('sha256')
    .update(req.params.vericode)
    .digest('hex');

  const user = await User.findOne({
    verificationCode,
    verificationCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid verification code', 403));
  }
  //mongoose syntax has an User.pre function to encrypt password before saving to DB
  //so no need to bcrypt password here
  const password = req.body.password;

  user.password = password;
  user.lastModifiedAt = Date.now();
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
  });
});

//desc    ACTIVATE account
//route   PUT /api/auth/generateVeriCode/activate/:vericode
//access  public
exports.activateAccount = asyncHandler(async (req, res, next) => {
  const verificationCode = crypto
    .createHash('sha256')
    .update(req.params.vericode)
    .digest('hex');

  const user = await User.findOne({
    verificationCode,
    verificationCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid activation code', 403));
  }

  user.active = true;
  user.lastModifiedAt = Date.now();
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
  });
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
  let user = await User.findById(userId);
  const s3Path = user.bucket;

  const bucketParams = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: `${s3Path}`,
  };

  const listedObjects = await s3.listObjectsV2(bucketParams).promise();

  const deleteParams = {
    Bucket: process.env.BUCKET_NAME,
    Delete: {
      Objects: [],
    },
  };

  for (const obj in listedObjects.Contents) {
    deleteParams.Delete.Objects.push({ Key: listedObjects.Contents[obj].Key });
  }

  //console.dir(deleteParams, { depth: null });

  await s3
    .deleteObjects(deleteParams, (err, data) => {
      if (err) console.error('upload err: ', err);
      if (data) console.log('delete success');
    })
    .promise();

  await Cert.deleteMany({ user: userId });
  await NonVer.deleteMany({ user: userId });

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
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
