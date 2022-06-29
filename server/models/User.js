const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email address',
    ],
    required: [true, 'Please provide your email address'],
  },
  backupEmail: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  active: {
    type: Boolean,
    // required: true,
    default: false,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
    required: true,
  },
  province: {
    type: String,
    required: [true, 'Please state your provincial jurisdiction'],
  },
  cpdMonth: {
    type: Number,
    required: true,
  },
  cpdYear: {
    type: Number,
    required: true,
  },
  cert: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Cert',
      required: true,
    },
  ],
  nonver: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'NonVer',
      required: true,
    },
  ],
  bucket: {
    type: String,
  },
  hours: [
    {
      year: {
        type: Number,
        required: true,
      },
      verifiable: {
        type: Number,
        required: true,
        default: 0,
      },
      nonVerifiable: {
        type: Number,
        required: true,
        default: 0,
      },
      ethics: {
        type: Number,
        required: true,
        default: 0,
      },
      overriden: {
        type: Boolean,
        required: true,
        default: false,
      },
      historic: {
        type: Boolean,
        required: true,
        default: true,
      },
      retro: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  },
  verificationCode: String,
  verificationCodeExpire: Date,
});

//encrypt password, if it is being modified
//skipped when requesting to change password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

UserSchema.methods.getVerificationCode = function () {
  const veriCodeNumber = getRandomInt(100000, 999999); //6 digits
  const veriCode = veriCodeNumber.toString();

  this.verificationCode = crypto
    .createHash('sha256')
    .update(veriCode)
    .digest('hex');

  this.verificationCodeExpire = Date.now() + 30 * 60 * 1000; //30 mins

  return veriCode;
};

module.exports = User = mongoose.model('User', UserSchema);
