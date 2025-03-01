const axios = require('axios');
const oauth = require('../src/utils/oauth');  // Adjust path as necessary
const jwt = require('jsonwebtoken');

// Mocking axios for making HTTP requests
jest.mock('axios');

describe('OAuth Utility Functions', () => {
    beforeAll(() => {
        // Set the environment variable for testing
        process.env.GITHUB_PRIVATE_KEY = 'mock-private-key';
    });

    // Test: Should generate a JWT
    it('should generate a JWT', () => {
        const payload = { user_id: 123 };
        const mockToken = 'mock-jwt-token';

        jest.spyOn(jwt, 'sign').mockImplementation(() => 'mock-jwt-token'); // Mock JWT signing properly

        const token = oauth.generateJWT(payload);

        expect(token).toBe(mockToken);
    });

    // Test: Should exchange OAuth code for access token
    test('should exchange OAuth code for access token', async () => {
        const oauthCode = 'dummy_oauth_code';
        
        // Mocking axios response correctly
        axios.post.mockResolvedValue({
            data: { access_token: 'dummy_access_token' }
        });

        const response = await oauth.exchangeTokenForAccessCode(oauthCode);

        // Ensure response is correctly returned
        expect(response).toBe('dummy_access_token');
    });

    // Test: Should get user details
    test('should get user details', async () => {
        const accessToken = 'dummy_access_token';
        
        // Mocking axios response correctly
        axios.get.mockResolvedValue({
            data: { login: 'test_user', id: 123 }
        });

        const user = await oauth.getUserDetails(accessToken);

        // ✅ Ensure user object matches expected values
        expect(user).toEqual({ login: 'test_user', id: 123 });
    });

    // Test: Should generate an app installation token
    test('should generate an app installation token', async () => {
        const installationId = 123456;
        
        // Mocking axios response correctly
        axios.post.mockResolvedValue({
            data: { token: 'dummy_installation_token' }
        });

        const token = await oauth.generateAppInstallationToken(installationId);

        // ✅ Ensure token is correctly extracted
        expect(token).toBe('dummy_installation_token');
    });

    // Test: Should handle errors when generating JWT
    test('should handle errors when generating JWT', async () => {
        const payload = { iss: 'dummy_app_id' };

        jest.spyOn(jwt, 'sign').mockImplementation(() => {
            throw new Error('payload is required');
        });

        try {
            oauth.generateJWT(payload);
        } catch (error) {
            expect(error.message).toBe('Failed to generate JWT');
        }
    });

    // Test: Should handle errors when exchanging OAuth code for token
    test('should handle errors when exchanging OAuth code for token', async () => {
        axios.post.mockRejectedValue(new Error('OAuth Code Exchange Failed'));

        try {
            await oauth.exchangeTokenForAccessCode('dummy_oauth_code');
        } catch (error) {
            expect(error.message).toBe('OAuth Code Exchange Failed');
        }
    });

    // Test: Should handle errors when fetching user details
    test('should handle errors when fetching user details', async () => {
        axios.get.mockRejectedValue(new Error('Failed to fetch user details'));

        try {
            await oauth.getUserDetails('dummy_access_token');
        } catch (error) {
            expect(error.message).toBe('Failed to fetch user details');
        }
    });

    // Test: Should handle errors when generating an app installation token
    test('should handle errors when generating app installation token', async () => {
        axios.post.mockRejectedValue(new Error('Failed to generate app installation token'));

        try {
            await oauth.generateAppInstallationToken(123456);
        } catch (error) {
            expect(error.message).toBe('Failed to generate JWT');
        }
    });

    afterAll(() => {
        // Clean up environment variable after tests
        delete process.env.GITHUB_PRIVATE_KEY;
    });
});
