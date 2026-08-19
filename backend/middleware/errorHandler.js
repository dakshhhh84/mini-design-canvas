const ApiError = require('./ApiError');

/**
 * Catches errors thrown (or passed to next()) anywhere in the request
 * pipeline and converts them into a consistent JSON response. Keeping
 * this in one place means route/controller code never has to format
 * error responses itself.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = err instanceof ApiError ? err.statusCode : 500;
  let message = err.message || 'Internal server error';

  // Mongoose validation errors -> 400 with a readable message
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose bad ObjectId -> 400 instead of a raw 500
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid id: ${err.value}`;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

/**
 * Wraps async route handlers so thrown errors / rejected promises are
 * forwarded to next() automatically instead of needing a try/catch in
 * every controller function.
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { errorHandler, asyncHandler };
