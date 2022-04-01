const User = require('../models/User');
const asyncHandler = require('../middleware/async');

//desc    OVERRIDE past years stats of current logged in user
//route   PUT /api/user/override/
//access  private
exports.overrideHours = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { year, certHours, nonVerHours, ethicsHours } = req.body;

  const query = { _id: userId, 'hours.year': year };
  const update = {
    $set: {
      'hours.$.verifiable': certHours,
      'hours.$.nonVerifiable': nonVerHours,
      'hours.$.ethics': ethicsHours,
      'hours.$.overriden': true,
      'hours.$.historic': true,
      'hours.$.retro': false,
      lastModifiedAt: Date.now(),
    },
  };

  await User.updateOne(query, update);

  const userUpdated = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: userUpdated });
});

//desc    UPDATE past year historic to false
//route   PUT /api/user/historicupdate/
//access  private
exports.historicUpdate = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { year } = req.body;

  const query = { _id: userId, 'hours.year': year };
  const update = {
    $set: {
      'hours.$.verifiable': 0,
      'hours.$.nonVerifiable': 0,
      'hours.$.ethics': 0,
      'hours.$.historic': true,
      'hours.$.retro': true,
      lastModifiedAt: Date.now(),
    },
  };

  await User.updateOne(query, update);

  const userUpdated = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: userUpdated });
});
