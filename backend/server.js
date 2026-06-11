require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`
  ========================================
  Server running in ${process.env.NODE_ENV || 'development'} mode
  Port: ${PORT}
  ========================================
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log('\nReceived shutdown signal. Closing server gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
