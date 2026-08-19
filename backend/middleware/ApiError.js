/**
 * A lightweight error class that carries an HTTP status code so the
 * central error handler can respond appropriately without guessing.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

module.exports = ApiError;
