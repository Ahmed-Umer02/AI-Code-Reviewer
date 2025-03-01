// /src/utils/oauth.js
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const githubConfig = require('../../config/githubConfig'); // GitHub app configuration
const { GITHUB_PRIVATE_KEY } = process.env;
const fs = require('fs');

if (!GITHUB_PRIVATE_KEY) {
  console.error('Private key not found in environment variables');
  throw new Error('Private key not found');
}

// Step 1: Generate a JWT (JSON Web Token) for the GitHub App
function generateJWT(payload) {
  if (!payload || typeof payload !== 'object') {
      throw new Error('payload is required');
  }

  try {
      const privateKey = process.env.PRIVATE_KEY || fs.readFileSync('private-key.pem', 'utf8');
      return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  } catch (error) {
      console.error('Error generating JWT:', error.message);
      throw new Error('Failed to generate JWT');
  }
}

// Step 2: Exchange the GitHub App JWT for an Access Token (OAuth flow)
async function exchangeTokenForAccessCode(code) {
  const payload = { iss: githubConfig.appId, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 600 };  
  let jwt;
  try {
    jwt = generateJWT(payload);
  } catch (error) {
    console.error('JWT generation failed:', error.message);
    throw new Error('OAuth Code Exchange Failed'); // Match the expected test output
  }

  try {
      const response = await axios.post(
          'https://github.com/login/oauth/access_token',
          {
              client_id: githubConfig.clientId,
              client_secret: githubConfig.clientSecret,
              code: code,
              redirect_uri: githubConfig.redirectUri,
          },
          {
              headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${jwt}`,
              },
          }
      );

      if (response.data.error) {
          throw new Error(`GitHub OAuth Error: ${response.data.error_description}`);
      }

      // Return the access token received from GitHub
      return response.data.access_token;
  } catch (error) {
      console.error('Error during GitHub OAuth exchange:', error.message);
      throw error.message;
  }
}

// Step 3: Retrieve the authenticated user's details
async function getUserDetails(accessToken) {
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        throw error;
    }
}

// Step 4: Generate a GitHub App installation access token
async function generateAppInstallationToken(installationId) {
    const payload = { iss: githubConfig.appId, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 600 };
    const jwt = generateJWT(payload);
    try {
        const response = await axios.post(
            `https://api.github.com/app/installations/${installationId}/access_tokens`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        if (response.data.error) {
            throw new Error(`GitHub App Token Error: ${response.data.error_description}`);
        }

        return response.data.token; // This is the installation access token
    } catch (error) {
        console.error('Error generating installation access token:', error.message);
        throw error;
    }
}

module.exports = {
    generateJWT,
    exchangeTokenForAccessCode,
    getUserDetails,
    generateAppInstallationToken,
};
