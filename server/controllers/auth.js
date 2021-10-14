const User = require('../models/User');
//const Cert = require('../models/Cert');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { currentYear } = require('../utils/currentYear');

//desc    CREATE user
//route   POST /api/auth/
//access  public
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, province, role } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse('This user already exists', 400));
  }

  if (!name || !email || !password) {
    return next(
      new ErrorResponse('Please provide name, email and password', 400)
    );
  }

  const hours = [
    {
      year: currentYear + 1,
      verifiable: 0,
      nonVerifiable: 0,
      ethics: 0,
    },
    {
      year: currentYear,
      verifiable: 0,
      nonVerifiable: 0,
      ethics: 0,
    },
    {
      year: currentYear - 1,
      verifiable: 0,
      nonVerifiable: 0,
      ethics: 0,
    },
  ];

  user = await User.create({
    name,
    email,
    password,
    province,
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
  const fakeCurrentYear = 2024;
  const userHours = user.hours;
  const lastYearDB = userHours[0].year;
  const catchUpYears = fakeCurrentYear - lastYearDB;

  for (let i = catchUpYears - 1; i > -1; i--) {
    userHours.unshift({
      year: fakeCurrentYear - i,
      verifiable: 0,
      nonVerifiable: 0,
      ethics: 0,
    });
  }

  await user.save();

  sendTokenResponse(user, 200, res);
});
//desc    GET current logged in user
//route   GET /api/auth/current
//access  private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('No user is logged in at the moment', 400));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

//desc    POST add hours to current User
//route   POST /api/auth/current/hours
//access  private
exports.addCPDHours = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('No user is logged in at the moment', 400));
  }

  const { year, verifiable, nonVerifiable, ethics } = req.body;
  const index = user.hours.findIndex((e) => e.year === year);

  if (index === -1) {
    return next(new ErrorResponse('Requested year is not found', 400));
  }

  if (ethics > verifiable) {
    return next(
      new ErrorResponse(
        'Ethics hours cannot be greater than Verifiable hours',
        400
      )
    );
  }

  if (verifiable > 0 && nonVerifiable > 0) {
    return next(
      new ErrorResponse(
        'A course can only be either Verifiable or non-Verifiable. Cannot be both.',
        400
      )
    );
  }

  const query = { _id: user._id, 'hours.year': year };

  if (verifiable > 0) {
    const update = {
      $inc: {
        'hours.$.verifiable': +verifiable,
      },
    };
    await User.updateOne(query, update);
  }

  if (nonVerifiable > 0) {
    const update = {
      $inc: {
        'hours.$.nonVerifiable': +nonVerifiable,
      },
    };
    await User.updateOne(query, update);
  }

  if (ethics > 0) {
    const update = {
      $inc: {
        'hours.$.ethics': +ethics,
      },
    };
    await User.updateOne(query, update);
  }

  res.status(200).json({ success: 'true' });
});

//desc    POST add verifiable hours to current User
//route   POST /api/auth/current/verifiable
//access  private
/* CURRENT NOT USING */
exports.addVerifiableHours = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('No user is logged in at the moment', 400));
  }

  const { year, hours } = req.body;

  const userHours = user.verifiable;
  const findYear = userHours.findIndex((e) => e.year === year);

  if (userHours.length === 0) {
    userHours.push({
      year: year,
      hours: hours,
    });
  } else if (userHours.length > 0 && findYear !== -1) {
    const query = { _id: user._id, 'verifiable.year': year };
    const update = {
      $inc: {
        'verifiable.$.hours': +hours,
      },
    };
    await User.updateOne(query, update);
  } else {
    userHours.push({
      year: year,
      hours: hours,
    });
  }

  await user.save();

  //the user data returned is one cycle out of date when updating via Mongo syntax
  res.status(200).json({ success: 'true', data: user });
});

//desc    POST add non-verifiable hours to current User
//route   POST /api/auth/current/nonverifiable
//access  private
/* CURRENT NOT USING */
exports.addNonVerifiableHours = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('No user is logged in at the moment', 400));
  }

  const { year, hours } = req.body;

  const userHours = user.nonVerifiable;
  const findYear = userHours.findIndex((e) => e.year === year);

  if (userHours.length === 0) {
    userHours.push({
      year: year,
      hours: hours,
    });
  } else if (userHours.length > 0 && findYear !== -1) {
    const query = { _id: user._id, 'nonVerifiable.year': year };
    const update = {
      $inc: {
        'nonVerifiable.$.hours': +hours,
      },
    };
    await User.updateOne(query, update);
  } else {
    userHours.push({
      year: year,
      hours: hours,
    });
  }

  await user.save();

  //the user data returned is one cycle out of date when updating via Mongo syntax
  res.status(200).json({ success: 'true', data: user });
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
