const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  //error is declared var, err is passed in argument

  let error = { ...err };
  error.message = err.message;

  //Log to console for dev
  console.log(error.message);

  //Mongoose bad Object id
  if (err.name === 'CastError') {
    const message = `Information not found`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  //default error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
