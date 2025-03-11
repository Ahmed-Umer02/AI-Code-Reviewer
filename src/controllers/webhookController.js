const { getCodeReview } = require('../services/codeLlamaService');
const githubAPI = require('../utils/githubAPI');

async function handlePullRequest(event) {
    try {
        // Extract pull request information (e.g., the code changes)
        const prUrl = event.pull_request.url;
        
        // Get the code from the pull request (you may need to fetch it via GitHub API)
        const code = await githubAPI.getPRCode(prUrl);
        console.log("1")
        // Send the code to the Hugging Face API for review
        const review = await getCodeReview(code);
        console.log("2")
        // Process the review (e.g., post comments on GitHub)
        await githubAPI.postPRReview(event.pull_request.id, review);
        console.log("3")
        return { success: true };
    } catch (error) {
        console.error('Error handling pull request:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { handlePullRequest };
