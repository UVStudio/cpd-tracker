const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@route   POST /api/upload
//@desc    Uploads file to DB
//@access  Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  try {
    res.json({ file: req.file });
    //console.log('req.file: ', req.file);
    // const profile = await Profile.findById(req.profile.id);
    // profile.avatarId = avatarId;
    // //console.log(profile);
    // await profile.save();
  } catch (err) {
    // res.render('index', { msg: err });
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
