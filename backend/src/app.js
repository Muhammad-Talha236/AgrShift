const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security and utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Ensure satellite tile cross-origin loading works smoothly
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, /vercel\.app$/, /localhost/] : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Routes
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AgriShift Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API Routes
const landingRoutes = require('./routes/landingRoutes');
const cropRoutes = require('./routes/cropRoutes');
const mapRoutes = require('./routes/mapRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

app.use('/api/landing', landingRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
