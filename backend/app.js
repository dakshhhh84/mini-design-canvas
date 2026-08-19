const express = require('express');
const cors = require('cors');
const canvasRoutes = require('./routes/canvasRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const ApiError = require('./middleware/ApiError');

function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());

  app.use(
    cors({
      origin: allowedOrigins,
    })
  );
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, status: 'ok' });
  });

  app.use('/api/canvases', canvasRoutes);

  // Unknown route -> 404
  app.use((req, res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
