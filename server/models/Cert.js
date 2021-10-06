const mongoose = require('mongoose');

const CertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  imgUrl: {
    type: String,
  },
  img: {
    type: mongoose.Schema.ObjectId,
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
