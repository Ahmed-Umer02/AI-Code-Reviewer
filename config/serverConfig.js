// /config/serverConfig.js
module.exports = {
    PORT: process.env.PORT || 3000,  // Server's port number
    ENV: process.env.NODE_ENV || 'development',  // Environment (development or production)
    HOST: process.env.HOST || 'localhost',  // Server host (e.g., localhost or production domain)
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',  // Base URL for your server (change to your production domain if applicable)
  };
  