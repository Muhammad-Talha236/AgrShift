require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    console.log('MongoDB Atlas connection established.');

    const server = app.listen(PORT, () => {
      console.log(
        `AgriShift backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );
    });

    return server;
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

const serverPromise = startServer();

module.exports = serverPromise;
