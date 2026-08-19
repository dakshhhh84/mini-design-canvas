require('dotenv').config();

const connectDB = require('./config/db');
const createApp = require('./app');

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

start();
