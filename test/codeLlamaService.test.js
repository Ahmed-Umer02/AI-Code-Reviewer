const { getCodeReview } = require('../src/services/codeLlamaService');
const axios = require('axios');

// Mocking axios to simulate Hugging Face API responses
jest.mock('axios');

describe('Code Llama Service', () => {
    it('should send code to Hugging Face API and receive a review', async () => {
        const codeSnippet = 'const x = 10; console.log(x);';  // Example code snippet

        // Simulating a successful response from Hugging Face API
        const mockResponse = {
            data: 'The code looks fine, but consider using `let` instead of `const` for variables that change.',
        };
        
        axios.post.mockResolvedValue(mockResponse);

        // Calling the function that interacts with Hugging Face
        const review = await getCodeReview(codeSnippet);

        // Verifying the result
        expect(review).toBe(mockResponse.data);
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('huggingface.co/models/codellama/CodeLlama-7b-hf'),
            { inputs: codeSnippet },
            expect.objectContaining({
                headers: { Authorization: expect.stringContaining('Bearer') }
            })
        );
    });

    it('should handle errors when the Hugging Face API fails', async () => {
        const codeSnippet = 'const x = 10; console.log(x);';

        // Simulating an error response from Hugging Face API
        axios.post.mockRejectedValue(new Error('API request failed'));

        // Calling the function and expecting it to throw an error
        await expect(getCodeReview(codeSnippet)).rejects.toThrow('Failed to get code review');
    });
});
