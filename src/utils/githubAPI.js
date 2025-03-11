const axios = require('axios');
const { GITHUB_TOKEN } = process.env;  // Assuming you are using an environment variable

// Function to get the code from a pull request
async function getPRCode(prUrl) {
    try {
        console.log("GitHub Token:", prUrl)
        const response = await axios.get(prUrl, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': "application/vnd.github.v3+json",
            }
        });
        console.log("Got through", response.data)
        // Assuming response.data contains the files changed in the pull request
        const filesChanged = response.data.files || [];
        let code = '';

        // Extracting code from the changed files
        for (const file of filesChanged) {
            if (file.status === 'modified' || file.status === 'added') {
                const fileContentResponse = await axios.get(file.raw_url);
                code += fileContentResponse.data; // Append each modified/added file's content
            }
        }
        console.log("Got through again", code)

        return code;
    } catch (error) {
        console.error('Error fetching PR code:', error.message);
        throw new Error('Failed to fetch pull request code');
    }
}

// Function to post a code review comment on the pull request
async function postPRReview(prId, review) {
    try {
        const url = `https://api.github.com/repos/owner/repo/pulls/${prId}/reviews`;  // Replace with actual repo info
        const response = await axios.post(url, {
            body: review,  // The review content generated by Code Llama
            event: 'COMMENT'  // Assuming you want to comment on the review, can be 'APPROVE' or 'REQUEST_CHANGES'
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': "application/vnd.github.v3+json",
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error posting PR review:', error.message);
        throw new Error('Failed to post pull request review');
    }
}

module.exports = { getPRCode, postPRReview };
