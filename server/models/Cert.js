const mongoose = require('mongoose');

const CertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  year: {
    type: Number,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  ethicsHours: {
    type: Number,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  img: {
    type: mongoose.Schema.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Cert = mongoose.model('Cert', CertSchema);
