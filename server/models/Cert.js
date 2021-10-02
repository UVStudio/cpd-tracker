const mongoose = require('mongoose');

const CertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Cert = mongoose.model('Cert', CertSchema);
