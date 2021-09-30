const mongoose = require('mongoose');

const CertSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Cert = mongoose.model('Cert', CertSchema);
