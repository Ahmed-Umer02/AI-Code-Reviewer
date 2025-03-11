const axios = require('axios');

// Your Hugging Face access token
const HF_TOKEN = process.env.HF_TOKEN;  // Store your token in .env for security

const modelName = 'codellama/CodeLlama-7b-hf';  // Use the Code Llama model

// Function to send code to Hugging Face API for review
async function getCodeReview(codeSnippet) {
    const url = `https://api-inference.huggingface.co/models/${modelName}`;
    const input_data = {
        inputs: JSON.stringify(codeSnippet)
    };

    try {
        const response = await axios.post(url, input_data, {
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`
            }
        });

        // Returning the output from the model
        return response.data;
    } catch (error) {
        console.error('Error interacting with Hugging Face API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get code review');
    }
}

module.exports = { getCodeReview };
