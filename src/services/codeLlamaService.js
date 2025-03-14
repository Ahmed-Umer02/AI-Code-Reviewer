const axios = require('axios');

// Your Hugging Face access token
const HF_TOKEN = process.env.HF_TOKEN;  // Store your token in .env for security

const modelName = 'codellama/CodeLlama-7b-hf';  // Use the Code Llama model

// Function to send code to Hugging Face API for review
async function getCodeReview(codeSnippet) {
    const url = `https://api-inference.huggingface.co/models/${modelName}`;
    const chunkSize = 10000; // Approx. 4096 tokens
    const chunks = [];
    code = JSON.stringify(codeSnippet)

    for (let i = 0; i < code.length; i += chunkSize) {
        chunks.push(code.substring(i, i + chunkSize));
    }
    
    let mergedResponse = [];
    // Process each chunk separately
    for (const chunk of chunks) {
        try {
            const response = await axios.post(url, chunk, {
                headers: {
                    'Authorization': `Bearer ${HF_TOKEN}`
                }
            });

            // Assuming response.data contains review comments or suggestions
            mergedResponse.push(response.data);
        } catch (error) {
            console.error("Error processing chunk:", error);
            mergedResponse.push({ error: "Failed to process chunk" });
        }
    }
    console.log(mergedResponse, "5")
    // Combine all responses into a single string or object
    return {
        success: true,
        review: mergedResponse.flat() // Flatten array in case responses are nested
    };
}

module.exports = { getCodeReview };
