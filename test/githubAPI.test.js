const axios = require('axios');
const githubAPI = require('../src/utils/githubAPI');
jest.mock('axios');

// Sample test data
const prUrl = 'https://api.github.com/repos/owner/repo/pulls/1';
const oauthToken = 'dummy_oauth_token';  // Mock OAuth token
const prId = 1;
const review = 'Looks good to me!';

// Mocked response data
const mockFilesChanged = [
  {
    status: 'modified',
    raw_url: 'https://raw.githubusercontent.com/owner/repo/main/file.js'
  }
];

describe('GitHub API', () => {
    beforeEach(() => {
        axios.get.mockReset();
        axios.post.mockReset();
    });

    it('should fetch code from a pull request', async () => {
        // Mocking axios.get for PR data and file content
        axios.get.mockResolvedValueOnce({
            data: { files: mockFilesChanged }
        });
        axios.get.mockResolvedValueOnce({
            data: 'const x = 10; console.log(x);'
        });

        const code = await githubAPI.getPRCode(prUrl);

        // Verifying that the code returned is correct
        expect(code).toBe('const x = 10; console.log(x);');
    });

    it('should handle errors when fetching pull request code', async () => {
        // Simulating an error response from GitHub API
        axios.get.mockRejectedValueOnce(new Error('GitHub API error'));

        await expect(githubAPI.getPRCode(prUrl, oauthToken)).rejects.toThrow('Failed to fetch pull request code');
    });

    it('should post a code review', async () => {
        // Mocking axios.post for posting review
        axios.post.mockResolvedValueOnce({
            data: { id: 123, body: review }
        });

        const response = await githubAPI.postPRReview(prId, review);

        // Verifying that the response contains correct review details
        expect(response.body).toBe(review);
    });

    it('should handle errors when posting code review', async () => {
        // Simulating an error response from GitHub API for posting review
        axios.post.mockRejectedValueOnce(new Error('GitHub API error'));

        await expect(githubAPI.postPRReview(prId, review)).rejects.toThrow('Failed to post pull request review');
    });
});
