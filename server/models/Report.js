const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  report: {
    type: mongoose.Schema.ObjectId,
  },
  year: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Report = mongoose.model('Report', ReportSchema);
