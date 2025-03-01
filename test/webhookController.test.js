const webhookController = require('../src/controllers/webhookController');
const codeLlamaService = require('../src/services/codeLlamaService');
const githubAPI = require('../src/utils/githubAPI');

// Mocking the external services
jest.mock('../src/services/codeLlamaService');
jest.mock('../src/utils/githubAPI');

describe('Webhook Controller', () => {
    it('should handle a pull request event and send code to Hugging Face API', async () => {
        const prEvent = {
            action: 'opened',
            pull_request: {
                id: 1,
                url: 'https://api.github.com/repos/owner/repo/pulls/1',
            },
        };

        // Mocking GitHub API to return code
        githubAPI.getPRCode.mockResolvedValue('const x = 10; console.log(x);');

        // Mocking the response from Code Llama
        codeLlamaService.getCodeReview.mockResolvedValue('The code looks fine.');

        // Mocking the post PR review response
        githubAPI.postPRReview.mockResolvedValue();

        const result = await webhookController.handlePullRequest(prEvent);

        // Verifying that the GitHub API methods and Hugging Face API were called
        expect(githubAPI.getPRCode).toHaveBeenCalledWith(prEvent.pull_request.url);
        expect(codeLlamaService.getCodeReview).toHaveBeenCalledWith('const x = 10; console.log(x);');
        expect(githubAPI.postPRReview).toHaveBeenCalledWith(prEvent.pull_request.id, 'The code looks fine.');

        // Verifying that the result is successful
        expect(result.success).toBe(true);
    });

    it('should handle errors when processing pull request events', async () => {
        const prEvent = {
            action: 'opened',
            pull_request: {
                id: 1,
                url: 'https://api.github.com/repos/owner/repo/pulls/1',
            },
        };

        // Mocking GitHub API to return code, but Code Llama fails
        githubAPI.getPRCode.mockResolvedValue('const x = 10; console.log(x);');
        codeLlamaService.getCodeReview.mockRejectedValue(new Error('Code review failed'));

        const result = await webhookController.handlePullRequest(prEvent);

        // Verifying that the result is unsuccessful
        expect(result.success).toBe(false);
        expect(result.error).toBe('Code review failed');
    });
});
