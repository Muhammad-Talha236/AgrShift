const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  isConnected = true;
  return conn;
};

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
};

module.exports = { connectDB, disconnectDB };
