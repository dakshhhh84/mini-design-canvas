const mongoose = require('mongoose');

/**
 * Establishes the connection to MongoDB using the URI supplied via
 * environment variables. The process exits if the connection fails,
 * since the API is unusable without a database.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined. Check your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
