const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { currentYear } = require('../utils/currentYear');

//desc    OVERRIDE current logged in user
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
      lastModifiedAt: Date.now(),
    },
  };

  await User.updateOne(query, update);

  const userUpdated = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: userUpdated });
});
