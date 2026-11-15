require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(
      `AgriShift backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });

  try {
    await connectDB();
    console.log('MongoDB Atlas connection established.');
  } catch (err) {
    console.warn('\n⚠️  MongoDB Atlas Connection Notice:');
    console.warn(`Could not reach MongoDB Atlas: ${err.message}`);
    console.warn('Note: If IP 0.0.0.0/0 is already added in Atlas, your current Wi-Fi network (e.g. University/Hostel Wi-Fi) is blocking outgoing port 27017.');
    console.warn('The server is running with fallback catalogs. Connect to Mobile Hotspot or VPN to reach live Atlas.\n');
  }

  return server;
}

const serverPromise = startServer();

module.exports = serverPromise;
