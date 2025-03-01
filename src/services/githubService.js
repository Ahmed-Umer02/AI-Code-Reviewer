// /src/services/githubService.js
const axios = require('axios');

const postReviewComment = async (owner, repo, prNumber, comment) => {
  try {
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
      {
        body: comment,
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error posting review comment:', error.message);
    throw new Error('Failed to post review comment');
  }
};

module.exports = { postReviewComment };
