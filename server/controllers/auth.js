const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

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

  user = await User.create({
    name,
    email,
    password,
    province,
    role,
  });

  sendTokenResponse(user, 200, res);
});

//desc    LOGIN user
//route   POST /api/auth/login
//access  public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  console.log('email:', email);
  console.log('password:', password);

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

  sendTokenResponse(user, 200, res);
});

//desc    GET current logged in user
//route   GET /api/auth/current
//access  private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  //console.log('current route user: ', req.user);

  if (!user) {
    return next(new ErrorResponse('No user is logged in at the moment', 400));
  }

  res.status(200).json({
    success: true,
    data: user,
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

/*** HELPER ***/
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  //where we save token to cookie, with options
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ token, user, options });
};
