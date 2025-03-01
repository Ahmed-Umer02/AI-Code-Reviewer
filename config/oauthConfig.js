// /config/oauthConfig.js
module.exports = {
    REDIRECT_URI: process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback',  // URL to redirect after OAuth login
    SCOPE: 'repo user',  // Permissions for the OAuth app (scopes like 'repo' or 'user')
    STATE: process.env.STATE || 'randomStateString',  // CSRF protection state parameter
  };
  