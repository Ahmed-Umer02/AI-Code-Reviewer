// /config/githubConfig.js
module.exports = {
    // GitHub App credentials
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || 'your-client-id',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || 'your-client-secret',
    GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET || 'your-webhook-secret',
    GITHUB_APP_ID: process.env.GITHUB_APP_ID || 'your-app-id',
    GITHUB_API_URL: 'https://api.github.com',  // GitHub's public API base URL
  };
  