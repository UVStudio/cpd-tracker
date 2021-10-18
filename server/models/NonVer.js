const mongoose = require('mongoose');

const NonVerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  year: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  sessionName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = NonVer = mongoose.model('NonVer', NonVerSchema);
